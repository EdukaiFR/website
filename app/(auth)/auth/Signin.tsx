import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export type SigninProps = {
  setSelectedOption: (option: string) => void;
};

// Schéma de validation avec zod
const signinSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type SigninFormValues = z.infer<typeof signinSchema>;

export const Signin = ({ setSelectedOption }: SigninProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SigninFormValues) => {
    setIsLoading(true);
    console.log('Form data:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    // Ajoutez ici la logique pour gérer la soumission du formulaire
  };

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* Header */}
      <div className='text-center space-y-1 sm:space-y-2'>
        <h2 className='text-2xl sm:text-3xl font-bold text-gray-900'>
          Content de te revoir !
        </h2>
        <p className='text-sm sm:text-base text-gray-600'>
          Connecte-toi pour accéder à ton espace d'apprentissage
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 sm:space-y-5'>
        {/* Email Field */}
        <div className='space-y-2'>
          <label htmlFor='email' className='text-sm font-medium text-gray-700 flex items-center gap-2'>
            <Mail className='w-4 h-4' />
            Adresse email
          </label>
          <div className='relative'>
            <Input
              id='email'
              type='email'
              placeholder='ton.email@exemple.com'
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

        {/* Password Field */}
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
          {errors.password && (
            <p className='text-sm text-red-500 flex items-center gap-1'>
              <span className='w-4 h-4 text-xs'>⚠</span>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember me & Forgot password */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0'>
          <div className='flex items-center space-x-3'>
            <Checkbox id='remember' className='border-2 border-gray-300' />
            <label
              htmlFor='remember'
              className='text-sm text-gray-700 font-medium cursor-pointer'
            >
              Se souvenir de moi
            </label>
          </div>
          <Button
            type='button'
            variant='link'
            className='text-sm text-blue-600 hover:text-blue-700 font-medium p-0 h-auto self-start sm:self-auto'
            onClick={() => setSelectedOption('forgot')}
          >
            Mot de passe oublié ?
          </Button>
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
              Connexion en cours...
            </span>
          ) : (
            <span className='flex items-center gap-2'>
              Se connecter
              <ArrowRight className='w-4 h-4' />
            </span>
          )}
        </Button>
      </form>
    </div>
  );
};
