'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const supabase = createClient();

  const schema = mode === 'login' ? loginSchema : signupSchema;
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData & { confirmPassword?: string }>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginFormData & { confirmPassword?: string }) => {
    setLoading(true);
    setError('');
    setSuccess('');

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        window.location.href = '/';
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Check your email for a confirmation link!');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F3F5] dark:bg-canvas-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-canvas-dark-elevated rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-8">
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <img src="/logo-light.png" alt="WillowSaves" className="w-9 h-9 rounded-full object-cover dark:hidden" />
            <img src="/logo-dark.png" alt="WillowSaves" className="w-9 h-9 rounded-full object-cover hidden dark:block" />
            <span className="font-display px-0 text-xl font-bold text-ink dark:text-ink-dark">
              WillowSaves
            </span>
          </div>

          <h1 className="text-xl font-heading font-bold text-ink dark:text-ink-dark mb-1 text-center">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm text-shade-50 mb-6 text-center">
            {mode === 'login' ? 'Sign in to access your savings' : 'Start tracking your savings today'}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-danger-soft text-danger text-sm font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-success-soft text-primary text-sm font-medium">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-shade-50 mb-1.5">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-hairline-light dark:border-hairline-dark bg-white dark:bg-canvas-dark-card text-ink dark:text-ink-dark text-sm font-medium focus:outline-none focus:border-primary transition-colors"
                placeholder="you@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-shade-50 mb-1.5">
                Password
              </label>
              <input
                type="password"
                {...register('password')}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-hairline-light dark:border-hairline-dark bg-white dark:bg-canvas-dark-card text-ink dark:text-ink-dark text-sm font-medium focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-danger">{errors.password.message}</p>
              )}
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-shade-50 mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  {...register('confirmPassword')}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-hairline-light dark:border-hairline-dark bg-white dark:bg-canvas-dark-card text-ink dark:text-ink-dark text-sm font-medium focus:outline-none focus:border-primary transition-colors"
                  placeholder="Confirm your password"
                />
                {(errors as any).confirmPassword && (
                  <p className="mt-1 text-xs text-danger">{(errors as any).confirmPassword.message}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[#2E8540] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#1F5C2E] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-shade-50">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <Link
              href={mode === 'login' ? '/signup' : '/login'}
              className="font-semibold text-[#2E8540] hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
