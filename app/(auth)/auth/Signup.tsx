'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';

export type SignupProps = {
  setSelectedOption: (option: string) => void;
};

// Validation schema
const signupSchema = z
  .object({
    firstName: z.string().min(2, 'Prénom requis (min. 2 caractères)'),
    lastName: z.string().min(2, 'Nom requis (min. 2 caractères)'),
    email: z.string().email('Adresse email invalide'),
    password: z
      .string()
      .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Le mot de passe doit contenir une majuscule, une minuscule et un chiffre'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export const Signup = ({ setSelectedOption }: SignupProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch('password');
  
  const passwordRequirements = [
    { label: 'Au moins 6 caractères', met: password?.length >= 6 },
    { label: 'Une majuscule', met: /[A-Z]/.test(password || '') },
    { label: 'Une minuscule', met: /[a-z]/.test(password || '') },
    { label: 'Un chiffre', met: /\d/.test(password || '') },
  ];

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    console.log('Form data:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    // Logic d'inscription ici
  };

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* Header */}
      <div className='text-center space-y-1 sm:space-y-2'>
        <h2 className='text-2xl sm:text-3xl font-bold text-gray-900'>
          Bienvenue sur Edukai !
        </h2>
        <p className='text-sm sm:text-base text-gray-600'>
          Crée ton compte pour commencer à apprendre dès maintenant
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 sm:space-y-5'>
        {/* Name Fields */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {/* First Name */}
          <div className='space-y-2'>
            <label htmlFor='firstName' className='text-sm font-medium text-gray-700 flex items-center gap-2'>
              <User className='w-4 h-4' />
              Prénom
            </label>
            <div className='relative'>
              <Input
                id='firstName'
                placeholder='John'
                {...register('firstName')}
                className={`pl-10 h-11 sm:h-12 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base ${
                  errors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200'
                }`}
              />
              <User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
            </div>
            {errors.firstName && (
              <p className='text-sm text-red-500 flex items-center gap-1'>
                <span className='w-4 h-4 text-xs'>⚠</span>
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className='space-y-2'>
            <label htmlFor='lastName' className='text-sm font-medium text-gray-700 flex items-center gap-2'>
              <User className='w-4 h-4' />
              Nom
            </label>
            <div className='relative'>
              <Input
                id='lastName'
                placeholder='Doe'
                {...register('lastName')}
                className={`pl-10 h-11 sm:h-12 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base ${
                  errors.lastName ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200'
                }`}
              />
              <User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
            </div>
            {errors.lastName && (
              <p className='text-sm text-red-500 flex items-center gap-1'>
                <span className='w-4 h-4 text-xs'>⚠</span>
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className='space-y-2'>
          <label htmlFor='email' className='text-sm font-medium text-gray-700 flex items-center gap-2'>
            <Mail className='w-4 h-4' />
            Adresse email
          </label>
          <div className='relative'>
            <Input
              id='email'
              type='email'
              placeholder='john.doe@exemple.com'
              {...register('email')}
              className={`pl-10 h-11 sm:h-12 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base ${
                errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200'
              }`}
            />
            <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
          </div>
          {errors.email && (
            <p className='text-sm text-red-500 flex items-center gap-1'>
              <span className='w-4 h-4 text-xs'>⚠</span>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className='space-y-2'>
          <label htmlFor='password' className='text-sm font-medium text-gray-700 flex items-center gap-2'>
            <Lock className='w-4 h-4' />
            Mot de passe
          </label>
          <div className='relative'>
            <Input
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='••••••••'
              {...register('password')}
              className={`pl-10 pr-12 h-11 sm:h-12 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base ${
                errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200'
              }`}
            />
            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1'
            >
              {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
            </button>
          </div>
          
          {/* Password Requirements */}
          {password && (
            <div className='bg-gray-50 rounded-lg p-3 space-y-2'>
              <p className='text-xs text-gray-600 font-medium'>Exigences du mot de passe :</p>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {passwordRequirements.map((req, index) => (
                  <div key={index} className='flex items-center gap-2 text-xs'>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      req.met ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'
                    }`}>
                      <Check className='w-2.5 h-2.5' />
                    </div>
                    <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {errors.password && (
            <p className='text-sm text-red-500 flex items-center gap-1'>
              <span className='w-4 h-4 text-xs'>⚠</span>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className='space-y-2'>
          <label htmlFor='confirmPassword' className='text-sm font-medium text-gray-700 flex items-center gap-2'>
            <Lock className='w-4 h-4' />
            Confirmer le mot de passe
          </label>
          <div className='relative'>
            <Input
              id='confirmPassword'
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='••••••••'
              {...register('confirmPassword')}
              className={`pl-10 pr-12 h-11 sm:h-12 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base ${
                errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200'
              }`}
            />
            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
            <button
              type='button'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1'
            >
              {showConfirmPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className='text-sm text-red-500 flex items-center gap-1'>
              <span className='w-4 h-4 text-xs'>⚠</span>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type='submit'
          disabled={isLoading}
          className='w-full h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base'
        >
          {isLoading ? (
            <span className='flex items-center gap-2'>
              <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
              Création du compte...
            </span>
          ) : (
            <span className='flex items-center gap-2'>
              Créer mon compte
              <ArrowRight className='w-4 h-4' />
            </span>
          )}
        </Button>
      </form>
    </div>
  );
};
