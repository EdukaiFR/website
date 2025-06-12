'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { ChangePasswordForm } from '@/components/auth';

export default function ChangePasswordPage() {
  const router = useRouter();

  const handleSuccess = () => {
    console.log('Password changed successfully');
    // Could redirect to profile page or stay on the same page
    // router.push('/profile');
  };

  const handleError = (error: string) => {
    console.error('Password change error:', error);
    // Handle error (could show toast notification)
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Image
                      src="/EdukaiLogo.svg"
                      alt="Logo Edukai"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Edukai
                  </h1>
                </div>
              </div>

              {/* Change Password Form */}
              <ChangePasswordForm
                onSuccess={handleSuccess}
                onError={handleError}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 