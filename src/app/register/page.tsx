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
  User,
  Eye,
  EyeOff,
  Flame,
  ShieldAlert,
  ArrowRight,
  Info,
} from 'lucide-react';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [simulatedNotice, setSimulatedNotice] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSimulatedNotice(null);

    const newErrors: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!fullName || fullName.trim().length < 3) {
      newErrors.fullName = 'Please enter your full name (at least 3 characters).';
    }

    if (!email || !email.includes('@')) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password || password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    // Simulate API registration request and show Phase 1 prototype response
    setTimeout(() => {
      setIsLoading(false);
      setSimulatedNotice(
        'Phase 1 Prototype Notice: Registration UI verified. Real encrypted user creation and session management will be implemented via Supabase in Phase 2.'
      );
    }, 850);
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
            Create Customer Account
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Join De Pizzano for order tracking and faster Cash on Delivery checkout.
          </p>
        </div>

        {/* Prototype Scope Banner */}
        <div className="mb-6 p-4 rounded-xl bg-surface border border-secondary/30 flex items-start gap-2.5 text-xs text-muted-light">
          <ShieldAlert className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-white block mb-0.5 uppercase tracking-wider">
              Phase 1 UI Prototype
            </strong>
            This customer registration interface contains complete input validation and is architected for Supabase authentication in Phase 2.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 shadow-2xl">
          {simulatedNotice && (
            <div className="mb-5 p-3.5 rounded-xl bg-surface-elevated border border-secondary/40 flex items-start gap-2 text-xs text-white">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-secondary" />
              <p className="leading-relaxed">{simulatedNotice}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              id="register-name"
              label="Full Name"
              required
              error={errors.fullName}
            >
              <Input
                id="register-name"
                placeholder="e.g., Usman Ali"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                }}
                error={!!errors.fullName}
                icon={<User className="w-4 h-4 text-muted" />}
                autoComplete="name"
              />
            </FormField>

            <FormField
              id="register-email"
              label="Email Address"
              required
              error={errors.email}
            >
              <Input
                id="register-email"
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
              id="register-password"
              label="Password"
              required
              helperText="Minimum 8 characters"
              error={errors.password}
            >
              <Input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                error={!!errors.password}
                icon={<Lock className="w-4 h-4 text-muted" />}
                autoComplete="new-password"
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

            <FormField
              id="register-confirm-password"
              label="Confirm Password"
              required
              error={errors.confirmPassword}
            >
              <Input
                id="register-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                error={!!errors.confirmPassword}
                icon={<Lock className="w-4 h-4 text-muted" />}
                autoComplete="new-password"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="p-1 text-muted hover:text-white transition-colors focus:outline-none"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
            </Button>
          </form>

          {/* Login link */}
          <div className="mt-6 pt-5 border-t border-surface-border text-center text-xs text-muted">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-secondary hover:underline font-bold inline-flex items-center gap-0.5 ml-1"
            >
              Sign In <ArrowRight className="w-3 h-3 inline" />
            </Link>
          </div>
        </div>

        {/* Guest checkout notice */}
        <div className="mt-6 text-center text-xs text-muted">
          <span>Don&apos;t want to register right now? </span>
          <Link href="/menu" className="text-white hover:underline font-semibold">
            Proceed with Guest Checkout
          </Link>
        </div>
      </Container>
    </div>
  );
}
