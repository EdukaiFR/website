/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { CreditCard, GraduationCap, User, Shield } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import {
    ProfileSettings,
    EducationSettings,
    SubscriptionSettings,
    AccountSettings,
} from "@/components/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    PersistentAlertsContainer,
    usePersistentAlerts,
} from "@/components/ui/persistent-alert";
import { useUserProfile } from "@/contexts/UserContext";
import { getImageDisplaySrc } from "@/lib/image-utils";

type TabKey = "profile" | "education" | "subscription" | "account";

interface Tab {
    key: TabKey;
    label: string;
    icon: React.ReactNode;
    description: string;
}

const tabs: Tab[] = [
    {
        key: "profile",
        label: "Profil",
        icon: <User className="w-5 h-5" />,
        description: "Informations personnelles et coordonnées",
    },
    {
        key: "education",
        label: "Études",
        icon: <GraduationCap className="w-5 h-5" />,
        description: "Niveau d'études et établissement",
    },
    {
        key: "subscription",
        label: "Abonnement",
        icon: <CreditCard className="w-5 h-5" />,
        description: "Plan d'abonnement et fonctionnalités",
    },
    {
        key: "account",
        label: "Compte",
        icon: <Shield className="w-5 h-5" />,
        description: "Sécurité et gestion du compte",
    },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("profile");
    const { alerts, addError, addSuccess, clearAllAlerts } =
        usePersistentAlerts();
    const {
        userProfile,
        loading: isLoading,
        refreshUserProfile,
    } = useUserProfile();

    useEffect(() => {
        // Clear alerts when component mounts
        clearAllAlerts();
    }, [clearAllAlerts]);

    const handleSuccess = async (message?: string) => {
        addSuccess(message || "Paramètres mis à jour avec succès !");
        // Reload user profile to get updated data
        await refreshUserProfile();
    };

    const handleError = (error: string) => {
        addError(error, "Erreur lors de la mise à jour");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">
                            Chargement de vos paramètres...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white">
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
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                                Paramètres
                            </h1>
                            <p className="text-gray-600">
                                Gérez vos informations personnelles et
                                préférences
                            </p>
                        </div>
                    </div>

                    {/* User Info Card */}
                    {userProfile && (
                        <Card className="bg-white/70 backdrop-blur-sm shadow-lg border-0">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold overflow-hidden">
                                        {getImageDisplaySrc(
                                            userProfile.profilePic
                                        ) ? (
                                            <Image
                                                src={
                                                    getImageDisplaySrc(
                                                        userProfile.profilePic
                                                    )!
                                                }
                                                alt="Photo de profil"
                                                fill
                                                className="object-cover"
                                                onError={() => {
                                                    // You could set a state here to fallback to initials
                                                    // For now we'll let it show the broken image placeholder
                                                }}
                                            />
                                        ) : (
                                            <>
                                                {userProfile.firstName.charAt(
                                                    0
                                                )}
                                                {userProfile.lastName.charAt(0)}
                                            </>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {userProfile.firstName}{" "}
                                            {userProfile.lastName}
                                        </h2>
                                        <p className="text-gray-600 text-sm">
                                            @{userProfile.username}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <GraduationCap className="w-4 h-4" />
                                                {userProfile.grade} •{" "}
                                                {userProfile.levelOfStudy}
                                            </span>
                                            {userProfile.institution && (
                                                <span className="flex items-center gap-1">
                                                    <Shield className="w-4 h-4" />
                                                    {userProfile.institution}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <CreditCard className="w-4 h-4" />
                                                Plan {userProfile.accountPlan}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Global Alerts */}
                <PersistentAlertsContainer alerts={alerts} className="mb-6" />

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <Card className="bg-white/70 backdrop-blur-sm shadow-lg border-0 sticky top-8">
                            <CardContent className="p-6">
                                <nav className="space-y-2">
                                    {tabs.map(tab => (
                                        <Button
                                            key={tab.key}
                                            variant={
                                                activeTab === tab.key
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className={`w-full justify-start h-auto p-4 ${
                                                activeTab === tab.key
                                                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                                                    : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                            onClick={() =>
                                                setActiveTab(tab.key)
                                            }
                                        >
                                            <div className="flex items-start gap-3 w-full">
                                                <div className="flex-shrink-0">
                                                    {tab.icon}
                                                </div>
                                                <div className="text-left flex-1 overflow-hidden">
                                                    <div className="font-semibold whitespace-normal break-words">
                                                        {tab.label}
                                                    </div>
                                                    <div
                                                        className={`text-xs mt-1 whitespace-normal break-words leading-relaxed max-w-full ${
                                                            activeTab ===
                                                            tab.key
                                                                ? "text-blue-100"
                                                                : "text-gray-500"
                                                        }`}
                                                        style={{
                                                            wordWrap:
                                                                "break-word",
                                                            overflowWrap:
                                                                "break-word",
                                                        }}
                                                    >
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
                            {/* Tab Content */}
                            {activeTab === "profile" && userProfile && (
                                <ProfileSettings
                                    initialData={{
                                        firstName: userProfile.firstName,
                                        lastName: userProfile.lastName,
                                        username: userProfile.username,
                                        profilePic:
                                            userProfile.profilePic || "",
                                        email: userProfile.email, // Pass email for display but it's not editable
                                    }}
                                    userId={userProfile._id}
                                    onSuccess={handleSuccess}
                                    onError={handleError}
                                />
                            )}

                            {activeTab === "education" && userProfile && (
                                <EducationSettings
                                    initialData={{
                                        grade: userProfile.grade,
                                        levelOfStudy: userProfile.levelOfStudy,
                                        institution:
                                            userProfile.institution || "",
                                    }}
                                    userId={userProfile._id}
                                    onSuccess={handleSuccess}
                                    onError={handleError}
                                />
                            )}

                            {activeTab === "subscription" && userProfile && (
                                <SubscriptionSettings
                                    initialData={{
                                        accountPlan: userProfile.accountPlan,
                                    }}
                                    userId={userProfile._id}
                                    onSuccess={handleSuccess}
                                    onError={handleError}
                                />
                            )}

                            {activeTab === "account" && userProfile && (
                                <AccountSettings
                                    userId={userProfile._id}
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
