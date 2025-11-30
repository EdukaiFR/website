/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { CreditCard, GraduationCap, School, Shield, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import {
    AccountSettings,
    EducationSettings,
    ProfileSettings,
    SubscriptionSettings,
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-8 space-y-6">
                    {/* User Info Card - Modern Glassmorphism Design */}
                    {userProfile && (
                        <Card className="bg-white/60 backdrop-blur-xl shadow-xl border border-white/40 overflow-hidden group hover:shadow-2xl transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <CardContent className="p-6 sm:p-8 relative">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                    {/* Profile Picture with Ring */}
                                    <div className="relative">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full opacity-75 blur group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden ring-4 ring-white">
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
                                                    {userProfile.lastName.charAt(
                                                        0
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                {userProfile.firstName}{" "}
                                                {userProfile.lastName}
                                            </h2>
                                            <p className="text-gray-600 text-base mt-0.5">
                                                @{userProfile.username}
                                            </p>
                                        </div>

                                        {/* Info Badges */}
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/80 backdrop-blur-sm border border-blue-100 rounded-full text-sm font-medium text-blue-700">
                                                <GraduationCap className="w-4 h-4" />
                                                <span>{userProfile.grade}</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100/80 backdrop-blur-sm border border-blue-200 rounded-full text-sm font-medium text-blue-800">
                                                <School className="w-4 h-4" />
                                                <span>
                                                    {userProfile.levelOfStudy}
                                                </span>
                                            </div>
                                            {userProfile.institution && (
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/80 backdrop-blur-sm border border-blue-100 rounded-full text-sm font-medium text-blue-700">
                                                    <Shield className="w-4 h-4" />
                                                    <span>
                                                        {
                                                            userProfile.institution
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full text-sm font-semibold text-white shadow-md">
                                                <CreditCard className="w-4 h-4" />
                                                <span>
                                                    Plan{" "}
                                                    {userProfile.accountPlan}
                                                </span>
                                            </div>
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
                    {/* Sidebar Navigation - Modern Design */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-4">
                            {/* Navigation Title */}
                            <div className="px-4">
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                    Navigation
                                </h2>
                            </div>

                            {/* Navigation Tabs */}
                            <Card className="bg-white/60 backdrop-blur-xl shadow-xl border border-white/40 overflow-hidden">
                                <CardContent className="p-3">
                                    <nav className="space-y-1">
                                        {tabs.map(tab => (
                                            <Button
                                                key={tab.key}
                                                variant="ghost"
                                                className={`w-full justify-start h-auto p-4 rounded-xl transition-all duration-200 ${
                                                    activeTab === tab.key
                                                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-600"
                                                        : "text-gray-700 hover:bg-blue-50/50 hover:text-blue-700"
                                                }`}
                                                onClick={() =>
                                                    setActiveTab(tab.key)
                                                }
                                            >
                                                <div className="flex items-start gap-3 w-full">
                                                    <div className="flex-shrink-0 mt-0.5">
                                                        {tab.icon}
                                                    </div>
                                                    <div className="text-left flex-1 overflow-hidden">
                                                        <div className="font-semibold text-base whitespace-normal break-words">
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
