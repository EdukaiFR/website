'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  User, 
  GraduationCap, 
  CreditCard, 
  Settings as SettingsIcon,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ProfileSettings,
  EducationSettings,
  SubscriptionSettings,
  PreferencesSettings
} from '@/components/settings';
import { getUserProfileAction, type UserProfile } from '@/lib/actions/user';

type TabKey = 'profile' | 'education' | 'subscription' | 'preferences';

interface Tab {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const tabs: Tab[] = [
  {
    key: 'profile',
    label: 'Profil',
    icon: <User className="w-5 h-5" />,
    description: 'Informations personnelles et coordonnées'
  },
  {
    key: 'education',
    label: 'Études',
    icon: <GraduationCap className="w-5 h-5" />,
    description: 'Niveau d\'études et spécialisations'
  },
  {
    key: 'subscription',
    label: 'Abonnement',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'Plan d\'abonnement et facturation'
  },
  {
    key: 'preferences',
    label: 'Préférences',
    icon: <SettingsIcon className="w-5 h-5" />,
    description: 'Notifications et confidentialité'
  }
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('profile');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setIsLoading(true);
    try {
      const result = await getUserProfileAction();
      if (result.success && result.data) {
        setUserProfile(result.data as UserProfile);
      } else {
        showNotification('error', 'Impossible de charger le profil utilisateur');
      }
    } catch (error) {
      showNotification('error', 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSuccess = () => {
    showNotification('success', 'Paramètres mis à jour avec succès !');
    // Reload user profile to get updated data
    loadUserProfile();
  };

  const handleError = (error: string) => {
    showNotification('error', error);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement de vos paramètres...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <Image
                src="/EdukaiLogo.svg"
                alt="Logo Edukai"
                width={48}
                height={48}
                className="rounded-full"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Paramètres
              </h1>
              <p className="text-gray-600">
                Gérez vos informations personnelles et préférences
              </p>
            </div>
          </div>

          {/* User Info Card */}
          {userProfile && (
            <Card className="bg-white/70 backdrop-blur-sm shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {userProfile.firstName.charAt(0)}{userProfile.lastName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {userProfile.firstName} {userProfile.lastName}
                    </h2>
                    <p className="text-gray-600">{userProfile.email}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-4 h-4" />
                        {userProfile.currentClass}
                      </span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-4 h-4" />
                        Plan {userProfile.subscriptionPlan}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-white/70 backdrop-blur-sm shadow-lg border-0 sticky top-8">
              <CardContent className="p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <Button
                      key={tab.key}
                      variant={activeTab === tab.key ? 'default' : 'ghost'}
                      className={`w-full justify-start h-auto p-4 ${
                        activeTab === tab.key
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      <div className="flex items-start gap-3">
                        {tab.icon}
                        <div className="text-left">
                          <div className="font-semibold">{tab.label}</div>
                          <div className={`text-xs mt-1 ${
                            activeTab === tab.key ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {tab.description}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Notification */}
              {notification && (
                <div className={`p-4 rounded-lg border ${
                  notification.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <div className="flex items-center gap-2">
                    {notification.type === 'success' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    {notification.message}
                  </div>
                </div>
              )}

              {/* Tab Content */}
              {activeTab === 'profile' && userProfile && (
                <ProfileSettings
                  initialData={{
                    firstName: userProfile.firstName,
                    lastName: userProfile.lastName,
                    email: userProfile.email,
                    dateOfBirth: userProfile.dateOfBirth,
                  }}
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              )}

              {activeTab === 'education' && userProfile && (
                <EducationSettings
                  initialData={{
                    educationLevel: userProfile.educationLevel,
                    currentClass: userProfile.currentClass,
                    specialization: userProfile.specialization,
                  }}
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              )}

              {activeTab === 'subscription' && userProfile && (
                <SubscriptionSettings
                  initialData={{
                    subscriptionPlan: userProfile.subscriptionPlan,
                  }}
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              )}

              {activeTab === 'preferences' && userProfile && (
                <PreferencesSettings
                  initialData={{
                    notifications: userProfile.notifications,
                    profileVisibility: userProfile.profileVisibility,
                    dataSharing: userProfile.dataSharing,
                  }}
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 