'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { FormField } from '@/components/forms/FormField';
import { Input } from '@/components/forms/Input';
import { Button } from '@/components/ui/Button';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Flame,
  ShieldAlert,
  ArrowRight,
  Info,
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [simulatedError, setSimulatedError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSimulatedError(null);

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

    // Simulate API request and show Phase 1 prototype response
    setTimeout(() => {
      setIsLoading(false);
      setSimulatedError(
        'Phase 1 Prototype Notice: Authentication will be connected with Supabase in Phase 2. No user accounts are stored in Phase 1.'
      );
    }, 800);
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
            Access your order history, saved addresses, and express checkout.
          </p>
        </div>

        {/* Prototype Scope Banner */}
        <div className="mb-6 p-4 rounded-xl bg-surface border border-secondary/30 flex items-start gap-2.5 text-xs text-muted-light">
          <ShieldAlert className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-white block mb-0.5 uppercase tracking-wider">
              Phase 1 UI Prototype
            </strong>
            This customer authentication interface is ready for Supabase backend integration in Phase 2.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 shadow-2xl">
          {simulatedError && (
            <div className="mb-5 p-3.5 rounded-xl bg-surface-elevated border border-primary/40 flex items-start gap-2 text-xs text-primary-light">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-secondary" />
              <p className="text-white leading-relaxed">{simulatedError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-muted-light">
                <input
                  type="checkbox"
                  className="rounded border-surface-border text-primary focus:ring-primary bg-surface-elevated"
                />
                Remember me
              </label>

              <button
                type="button"
                onClick={() =>
                  alert('Password recovery will be handled by Supabase Auth in Phase 2.')
                }
                className="text-secondary hover:underline font-semibold"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              className="w-full justify-center shadow-glow-red font-bold text-sm mt-3"
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Account'}
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

        {/* Guest checkout notice */}
        <div className="mt-6 text-center text-xs text-muted">
          <span>Just looking to order food without an account? </span>
          <Link href="/menu" className="text-white hover:underline font-semibold">
            Browse Menu & Order as Guest
          </Link>
        </div>
      </Container>
    </div>
  );
}
