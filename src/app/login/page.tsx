'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { FormField } from '@/components/forms/FormField';
import { Input } from '@/components/forms/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Flame,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/orders';

  const { signInWithGoogle, signInWithPassword, isConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMessage(error.message);
      setIsGoogleLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const newErrors: { email?: string; password?: string } = {};

    if (!email || !email.includes('@')) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    const { error } = await signInWithPassword({ email, password });
    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    } else {
      router.push(redirectTarget);
    }
  };

  return (
    <div className="py-12 sm:py-20 bg-background min-h-[85vh] flex items-center">
      <Container size="sm">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-3 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-glow-red">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white font-display uppercase tracking-wider">
              DE PIZZANO
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-wide">
            Customer Login
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Access your verified orders, saved addresses, and live Cash on Delivery status.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 shadow-2xl">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-primary/50 flex items-start gap-2.5 text-xs text-primary-light">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-primary-light" />
              <p className="leading-relaxed font-medium">{errorMessage}</p>
            </div>
          )}

          {/* 1. Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-surface-border bg-surface-elevated hover:bg-surface-highlight text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-3 shadow-sm hover:border-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-border" />
            </div>
            <span className="relative px-3 bg-surface text-[11px] text-muted uppercase font-semibold">
              Or sign in with email
            </span>
          </div>

          {/* 2. Email & Password Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <FormField
              id="login-email"
              label="Email Address"
              required
              error={errors.email}
            >
              <Input
                id="login-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                error={!!errors.email}
                icon={<Mail className="w-4 h-4 text-muted" />}
                autoComplete="email"
              />
            </FormField>

            <FormField
              id="login-password"
              label="Password"
              required
              error={errors.password}
            >
              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                error={!!errors.password}
                icon={<Lock className="w-4 h-4 text-muted" />}
                autoComplete="current-password"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-muted hover:text-white transition-colors focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </FormField>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              className="w-full justify-center shadow-glow-red font-bold text-sm mt-3"
            >
              {isLoading ? 'Authenticating with Supabase...' : 'Sign In to Account'}
            </Button>
          </form>

          {/* Registration link */}
          <div className="mt-6 pt-5 border-t border-surface-border text-center text-xs text-muted">
            Don&apos;t have a customer account yet?{' '}
            <Link
              href="/register"
              className="text-secondary hover:underline font-bold inline-flex items-center gap-0.5 ml-1"
            >
              Create Account <ArrowRight className="w-3 h-3 inline" />
            </Link>
          </div>
        </div>

        {/* Security badge note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted text-center">
          <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
          <span>Secured with Supabase Authentication & PostgreSQL Row Level Security (RLS)</span>
        </div>
      </Container>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <Container size="sm">
            <div className="animate-pulse space-y-4">
              <div className="w-16 h-16 rounded-full bg-surface mx-auto" />
              <div className="h-6 w-48 bg-surface rounded mx-auto" />
            </div>
          </Container>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
