'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export type ResetPasswordProps = {
  setSelectedOption: (option: string) => void;
};

const resetPasswordSchema = z.object({
  email: z.string().email('Adresse email invalide'),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ResetPassword = ({ setSelectedOption }: ResetPasswordProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    console.log('Reset email sent to:', data.email);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsEmailSent(true);
    // Ici, tu pourrais déclencher un appel API vers Supabase ou autre
  };

  if (isEmailSent) {
    return (
      <div className='space-y-4 sm:space-y-6 text-center'>
        {/* Success Icon */}
        <div className='flex justify-center'>
          <div className='w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center'>
            <CheckCircle className='w-6 h-6 sm:w-8 sm:h-8 text-green-600' />
          </div>
        </div>
        
        {/* Success Message */}
        <div className='space-y-1 sm:space-y-2'>
          <h2 className='text-xl sm:text-2xl font-bold text-gray-900'>
            Email envoyé !
          </h2>
          <p className='text-sm sm:text-base text-gray-600'>
            Nous avons envoyé un lien de réinitialisation à
          </p>
          <p className='font-medium text-blue-600 text-sm sm:text-base break-all'>
            {getValues('email')}
          </p>
        </div>

        {/* Instructions */}
        <div className='bg-blue-50 rounded-lg p-3 sm:p-4 space-y-2'>
          <p className='text-sm text-blue-800 font-medium'>
            Prochaines étapes :
          </p>
          <ul className='text-sm text-blue-700 space-y-1 text-left'>
            <li>• Vérifie ta boîte de réception et tes spams</li>
            <li>• Clique sur le lien dans l'email reçu</li>
            <li>• Crée ton nouveau mot de passe</li>
          </ul>
        </div>

        {/* Actions */}
        <div className='space-y-3'>
          <Button
            onClick={() => setIsEmailSent(false)}
            variant='outline'
            className='w-full h-11 sm:h-12 border-2 border-gray-200 hover:border-gray-300 rounded-xl text-base'
          >
            Renvoyer l'email
          </Button>
          <Button
            onClick={() => setSelectedOption('login')}
            variant='ghost'
            className='w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium text-sm sm:text-base'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Retour à la connexion
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* Header */}
      <div className='text-center space-y-1 sm:space-y-2'>
        <h2 className='text-2xl sm:text-3xl font-bold text-gray-900'>
          Mot de passe oublié ?
        </h2>
        <p className='text-sm sm:text-base text-gray-600'>
          Pas de souci ! Entre ton email et on t'envoie un lien de réinitialisation
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

        {/* Info Box */}
        <div className='bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4'>
          <div className='flex items-start gap-3'>
            <div className='w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0'>ℹ️</div>
            <div className='text-sm text-amber-800'>
              <p className='font-medium mb-1'>Note importante :</p>
              <p>
                Si tu ne reçois pas l'email dans les 5 minutes, pense à vérifier 
                tes courriers indésirables (spam).
              </p>
            </div>
          </div>
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
              Envoi en cours...
            </span>
          ) : (
            <span className='flex items-center gap-2'>
              Envoyer le lien
              <ArrowRight className='w-4 h-4' />
            </span>
          )}
        </Button>

        {/* Back to Login */}
        <Button
          type='button'
          variant='ghost'
          onClick={() => setSelectedOption('login')}
          className='w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium text-sm sm:text-base'
        >
          <ArrowLeft className='w-4 h-4 mr-2' />
          Retour à la connexion
        </Button>
      </form>
    </div>
  );
};
