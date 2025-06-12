'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { User, Mail, Calendar, Save } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { profileSettingsSchema, type ProfileSettingsFormValues } from '@/lib/schemas/user';
import { updateProfileAction } from '@/lib/actions/user';

export interface ProfileSettingsProps {
  initialData?: ProfileSettingsFormValues;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function ProfileSettings({ initialData, onSuccess, onError }: ProfileSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setError,
    reset,
  } = useForm<ProfileSettingsFormValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: initialData || {
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
    },
  });

  const onSubmit = async (data: ProfileSettingsFormValues) => {
    setIsLoading(true);
    
    try {
      const result = await updateProfileAction(data);
      
      if (result.success) {
        reset(data);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Informations personnelles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                Prénom
              </label>
              <Input
                id="firstName"
                type="text"
                placeholder="Votre prénom"
                {...register('firstName')}
                className={`h-11 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                  errors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200'
                }`}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="w-4 h-4 text-xs">⚠</span>
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Nom
              </label>
              <Input
                id="lastName"
                type="text"
                placeholder="Votre nom"
                {...register('lastName')}
                className={`h-11 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                  errors.lastName ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200'
                }`}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="w-4 h-4 text-xs">⚠</span>
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Adresse email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="votre.email@exemple.com"
              {...register('email')}
              className={`h-11 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200'
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="w-4 h-4 text-xs">⚠</span>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Date of Birth Field */}
          <div className="space-y-2">
            <label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date de naissance (optionnel)
            </label>
            <Input
              id="dateOfBirth"
              type="date"
              {...register('dateOfBirth')}
              className="h-11 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 border-gray-200"
            />
          </div>

          {/* Error Display */}
          {errors.root && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <span className="text-red-500">⚠</span>
                {errors.root.message}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading || !isDirty}
              className="px-6 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sauvegarde...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </span>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 