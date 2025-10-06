"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/shared/FormField';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { LinkText } from '@/components/shared/LinkText';

// Define the login form schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      await login(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label="Email"
        error={errors.email?.message}
      >
        <Input
          type="email"
          placeholder="Enter your email"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
        />
      </FormField>

      <FormField
        label="Password"
        error={errors.password?.message}
        className="mt-4"
      >
        <Input
          type="password"
          placeholder="Enter your password"
          {...register('password')}
          className={errors.password ? 'border-red-500' : ''}
        />
      </FormField>

      <div className="flex items-center justify-between mt-4">
        <label className="flex items-center">
          <input type="checkbox" className="form-checkbox" />
          <span className="ml-2 text-sm text-gray-600">Remember me</span>
        </label>
        <a href="#forgot-password" className="text-sm text-blue-600 hover:underline">
          Forgot Password?
        </a>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="w-full mt-6"
      >
        {isSubmitting || isLoading ? 'Logging in...' : 'Login'}
      </Button>

      {/* Error Message */}
      {error && <ErrorMessage message={error} />}

      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <LinkText href="/register">Sign Up</LinkText>
      </p>
    </form>
  );
};
