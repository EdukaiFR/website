'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SigninForm } from './signin-form';
import { SignupForm } from './signup-form';
import { ResetPasswordForm } from './reset-password-form';
import type { AuthMode } from '@/lib/schemas/auth';

export interface AuthContainerProps {
  initialMode?: AuthMode;
  onAuthSuccess?: () => void;
  onAuthError?: (error: string) => void;
}

export function AuthContainer({ 
  initialMode = 'login',
  onAuthSuccess,
  onAuthError 
}: AuthContainerProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  const handleAuthSuccess = () => {
    console.log('Auth success for mode:', mode);
    onAuthSuccess?.();
  };

  const handleAuthError = (error: string) => {
    console.error('Auth error for mode:', mode, error);
    onAuthError?.(error);
  };

  const renderAuthForm = () => {
    switch (mode) {
      case 'login':
        return (
          <SigninForm
            onSuccess={handleAuthSuccess}
            onError={handleAuthError}
            onForgotPassword={() => setMode('forgot')}
          />
        );
      case 'register':
        return (
          <SignupForm
            onSuccess={handleAuthSuccess}
            onError={handleAuthError}
          />
        );
      case 'forgot':
        return (
          <ResetPasswordForm
            onSuccess={handleAuthSuccess}
            onError={handleAuthError}
            onBack={() => setMode('login')}
          />
        );
      default:
        return null;
    }
  };

  const renderFooterNavigation = () => {
    if (mode === 'forgot') {
      return null; // Reset password form handles its own navigation
    }

    return (
      <div className="mt-6 sm:mt-8 text-center">
        {mode === 'login' && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?
            </p>
            <Button
              variant="ghost"
              onClick={() => setMode('register')}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium text-sm sm:text-base"
            >
              Créer un compte gratuitement
            </Button>
          </div>
        )}
        {mode === 'register' && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Déjà un compte ?
            </p>
            <Button
              variant="ghost"
              onClick={() => setMode('login')}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium text-sm sm:text-base"
            >
              Se connecter
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Auth Form */}
      {renderAuthForm()}
      
      {/* Footer Navigation */}
      {renderFooterNavigation()}
    </div>
  );
} 