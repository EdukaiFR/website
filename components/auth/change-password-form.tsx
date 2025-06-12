'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Eye, EyeOff, Lock, Check, CheckCircle } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { changePasswordSchema, type ChangePasswordFormValues, getPasswordRequirements } from '@/lib/schemas/auth';
import { changePasswordAction } from '@/lib/actions/auth';

export interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

export function ChangePasswordForm({ onSuccess, onError, onCancel }: ChangePasswordFormProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    reset,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const newPassword = watch('newPassword');
  const passwordRequirements = getPasswordRequirements(newPassword || '');
  
  const onSubmit = async (data: ChangePasswordFormValues) => {
    setIsLoading(true);
    
    try {
      const result = await changePasswordAction(data);
      
      if (result.success) {
        setIsSuccess(true);
        reset();
        onSuccess?.();
      } else {
        const errorMessage = result.error || 'Une erreur est survenue';
        setError('root', { message: errorMessage });
        onError?.(errorMessage);
      }
    } catch (error) {
      const errorMessage = 'Une erreur inattendue est survenue';
      setError('root', { message: errorMessage });
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className='space-y-4 sm:space-y-6'>
        {/* Success Header */}
        <div className='text-center space-y-3 sm:space-y-4'>
          <div className='mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
            <CheckCircle className='w-8 h-8 text-green-600' />
          </div>
          <h2 className='text-2xl sm:text-3xl font-bold text-gray-900'>
            Mot de passe mis à jour !
          </h2>
          <p className='text-sm sm:text-base text-gray-600 max-w-md mx-auto'>
            Votre mot de passe a été modifié avec succès. Vous pouvez maintenant utiliser votre nouveau mot de passe pour vous connecter.
          </p>
        </div>

        {/* Actions */}
        <div className='space-y-3'>
          <Button
            onClick={() => setIsSuccess(false)}
            className='w-full h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-base'
          >
            Changer à nouveau
          </Button>
          
          {onCancel && (
            <Button
              onClick={onCancel}
              variant='ghost'
              className='w-full h-11 sm:h-12 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200 text-base'
            >
              Retour
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* Header */}
      <div className='text-center space-y-1 sm:space-y-2'>
        <h2 className='text-2xl sm:text-3xl font-bold text-gray-900'>
          Changer de mot de passe
        </h2>
        <p className='text-sm sm:text-base text-gray-600'>
          Saisissez votre mot de passe actuel et choisissez-en un nouveau.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 sm:space-y-5'>
        {/* Current Password Field */}
        <div className='space-y-2'>
          <label htmlFor='currentPassword' className='text-sm font-medium text-gray-700 flex items-center gap-2'>
            <Lock className='w-4 h-4' />
            Mot de passe actuel
          </label>
          <div className='relative'>
            <Input
              id='currentPassword'
              type={showCurrentPassword ? 'text' : 'password'}
              placeholder='••••••••'
              {...register('currentPassword')}
              className={`pl-10 pr-12 h-11 sm:h-12 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base ${
                errors.currentPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200'
              }`}
            />
            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
            <button
              type='button'
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1'
            >
              {showCurrentPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className='text-sm text-red-500 flex items-center gap-1'>
              <span className='w-4 h-4 text-xs'>⚠</span>
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password Field */}
        <div className='space-y-2'>
          <label htmlFor='newPassword' className='text-sm font-medium text-gray-700 flex items-center gap-2'>
            <Lock className='w-4 h-4' />
            Nouveau mot de passe
          </label>
          <div className='relative'>
            <Input
              id='newPassword'
              type={showNewPassword ? 'text' : 'password'}
              placeholder='••••••••'
              {...register('newPassword')}
              className={`pl-10 pr-12 h-11 sm:h-12 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base ${
                errors.newPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200'
              }`}
            />
            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
            <button
              type='button'
              onClick={() => setShowNewPassword(!showNewPassword)}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1'
            >
              {showNewPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
            </button>
          </div>
          
          {/* Password Requirements */}
          {newPassword && (
            <div className='mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200'>
              <p className='text-xs font-semibold text-gray-700 mb-2'>Critères du nouveau mot de passe :</p>
              <div className='grid grid-cols-2 gap-2'>
                {passwordRequirements.map((req, index) => (
                  <div key={index} className='flex items-center gap-2'>
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                      req.met ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {req.met && <Check className='w-2 h-2 text-white' />}
                    </div>
                    <span className={`text-xs ${req.met ? 'text-green-700' : 'text-gray-600'}`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {errors.newPassword && (
            <p className='text-sm text-red-500 flex items-center gap-1'>
              <span className='w-4 h-4 text-xs'>⚠</span>
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm New Password Field */}
        <div className='space-y-2'>
          <label htmlFor='confirmNewPassword' className='text-sm font-medium text-gray-700 flex items-center gap-2'>
            <Lock className='w-4 h-4' />
            Confirmer le nouveau mot de passe
          </label>
          <div className='relative'>
            <Input
              id='confirmNewPassword'
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='••••••••'
              {...register('confirmNewPassword')}
              className={`pl-10 pr-12 h-11 sm:h-12 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base ${
                errors.confirmNewPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200'
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
          {errors.confirmNewPassword && (
            <p className='text-sm text-red-500 flex items-center gap-1'>
              <span className='w-4 h-4 text-xs'>⚠</span>
              {errors.confirmNewPassword.message}
            </p>
          )}
        </div>

        {/* Error Display */}
        {errors.root && (
          <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-sm text-red-600 flex items-center gap-2'>
              <span className='text-red-500'>⚠</span>
              {errors.root.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className='space-y-3'>
          <Button
            type='submit'
            disabled={isLoading}
            className='w-full h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base'
          >
            {isLoading ? (
              <span className='flex items-center gap-2'>
                <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                Modification en cours...
              </span>
            ) : (
              'Changer le mot de passe'
            )}
          </Button>

          {onCancel && (
            <Button
              type='button'
              onClick={onCancel}
              variant='ghost'
              className='w-full h-11 sm:h-12 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200 text-base'
            >
              Annuler
            </Button>
          )}
        </div>
      </form>
    </div>
  );
} 