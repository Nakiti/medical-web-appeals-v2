"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/shared/FormField';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { LinkText } from '@/components/shared/LinkText';

// Define the register form schema
const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = ({redirectUrl}) => {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      
      // Register the user using the auth service
      const { registerUser } = await import('@/lib/services/auth.service');
      await registerUser(data);

      // Auto-login after successful registration
      try {
        await login({
          email: data.email,
          password: data.password,
        });
        router.push(redirectUrl);
      } catch (loginError) {
        // If auto-login fails, redirect to login page
        router.push('/login');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label="Full Name"
        error={errors.name?.message}
      >
        <Input
          type="text"
          placeholder="Enter your full name"
          {...register('name')}
          className={errors.name ? 'border-red-500' : ''}
        />
      </FormField>

      <FormField
        label="Email"
        error={errors.email?.message}
        className="mt-4"
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

      <FormField
        label="Confirm Password"
        error={errors.confirmPassword?.message}
        className="mt-4"
      >
        <Input
          type="password"
          placeholder="Confirm your password"
          {...register('confirmPassword')}
          className={errors.confirmPassword ? 'border-red-500' : ''}
        />
      </FormField>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-6"
      >
        {isSubmitting ? 'Creating Account...' : 'Register'}
      </Button>

      {/* Error Message */}
      {error && <ErrorMessage message={error} />}

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <LinkText href="/login">Login</LinkText>
      </p>
    </form>
  );
};
