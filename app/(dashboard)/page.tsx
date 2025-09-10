"use client";

import {
    Calendar,
    Target,
    Activity,
    BookOpen,
    Trophy,
    Clock,
    TrendingUp,
    Star,
} from "lucide-react";
import { useUserProfile } from "@/contexts/UserContext";

export default function Home() {
    const { userProfile, loading } = useUserProfile();

    // Détermine le nom à afficher
    const getDisplayName = () => {
        if (!userProfile) return "";

        // Si le username est une adresse email ou identique à l'email
        if (
            userProfile.username.includes("@") ||
            userProfile.username === userProfile.email
        ) {
            // Affiche firstName et première lettre du lastName
            return `${userProfile.firstName} ${userProfile.lastName.charAt(0)}.`;
        }

        // Sinon affiche le username
        return userProfile.username;
    };
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
            {/* Beautiful Header Section */}
            <header className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

                {/* Floating Elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute top-32 right-20 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-indigo-300/15 rounded-full blur-xl"></div>

                <div className="relative z-10 container mx-auto px-6 py-16 lg:py-20">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        {/* Left Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                                <BookOpen className="w-5 h-5" />
                                <span className="text-sm font-medium">
                                    Tableau de Bord
                                </span>
                            </div>

                            <h1 className="text-2xl lg:text-4xl font-bold mb-6 leading-tight">
                                Bienvenue
                                <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                                    {loading ? (
                                        <span className="inline-block animate-pulse bg-yellow-300/30 rounded h-10 w-32"></span>
                                    ) : (
                                        getDisplayName()
                                    )}
                                </span>
                            </h1>

                            <p className="text-base lg:text-lg text-blue-100 mb-8 max-w-2xl">
                                Voici un petit résumé de ton compte et de tes
                                progrès récents dans ton parcours
                                d&apos;apprentissage.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl hover:transform hover:scale-105">
                                    <BookOpen className="w-6 h-6" />
                                    Continuer l&apos;Apprentissage
                                </button>
                                <button className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200">
                                    <Target className="w-6 h-6" />
                                    Voir les Objectifs
                                </button>
                            </div>
                        </div>

                        {/* Right Content - Quick Stats */}
                        <div className="flex-1 max-w-md">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Courses Progress */}
                                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30 transition-all duration-300 hover:bg-white/30 hover:backdrop-blur-md hover:shadow-2xl hover:shadow-white/20 hover:scale-105 hover:border-white/50 cursor-pointer group">
                                    <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:bg-blue-400/30 group-hover:scale-110">
                                        <BookOpen className="w-6 h-6 text-blue-300 transition-all duration-300 group-hover:text-blue-200" />
                                    </div>
                                    <div className="text-xl font-bold mb-1 transition-all duration-300 group-hover:scale-110">
                                        12
                                    </div>
                                    <div className="text-blue-100 text-sm transition-all duration-300 group-hover:text-white">
                                        Cours en Cours
                                    </div>
                                </div>

                                {/* Study Time */}
                                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30 transition-all duration-300 hover:bg-white/30 hover:backdrop-blur-md hover:shadow-2xl hover:shadow-white/20 hover:scale-105 hover:border-white/50 cursor-pointer group">
                                    <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:bg-green-400/30 group-hover:scale-110">
                                        <Clock className="w-6 h-6 text-green-300 transition-all duration-300 group-hover:text-green-200" />
                                    </div>
                                    <div className="text-xl font-bold mb-1 transition-all duration-300 group-hover:scale-110">
                                        45h
                                    </div>
                                    <div className="text-blue-100 text-sm transition-all duration-300 group-hover:text-white">
                                        Temps d&apos;Étude
                                    </div>
                                </div>

                                {/* Achievements */}
                                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30 transition-all duration-300 hover:bg-white/30 hover:backdrop-blur-md hover:shadow-2xl hover:shadow-white/20 hover:scale-105 hover:border-white/50 cursor-pointer group">
                                    <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:bg-yellow-400/30 group-hover:scale-110">
                                        <Trophy className="w-6 h-6 text-yellow-300 transition-all duration-300 group-hover:text-yellow-200" />
                                    </div>
                                    <div className="text-xl font-bold mb-1 transition-all duration-300 group-hover:scale-110">
                                        8
                                    </div>
                                    <div className="text-blue-100 text-sm transition-all duration-300 group-hover:text-white">
                                        Succès Débloqués
                                    </div>
                                </div>

                                {/* Progress */}
                                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30 transition-all duration-300 hover:bg-white/30 hover:backdrop-blur-md hover:shadow-2xl hover:shadow-white/20 hover:scale-105 hover:border-white/50 cursor-pointer group">
                                    <div className="w-12 h-12 bg-purple-400/20 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:bg-purple-400/30 group-hover:scale-110">
                                        <TrendingUp className="w-6 h-6 text-purple-300 transition-all duration-300 group-hover:text-purple-200" />
                                    </div>
                                    <div className="text-xl font-bold mb-1 transition-all duration-300 group-hover:scale-110">
                                        78%
                                    </div>
                                    <div className="text-blue-100 text-sm transition-all duration-300 group-hover:text-white">
                                        Progression
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Wave */}
                <div className="absolute bottom-0 left-0 w-full">
                    <svg
                        className="w-full h-12 lg:h-20 text-blue-50"
                        preserveAspectRatio="none"
                        viewBox="0 0 1440 120"
                        fill="currentColor"
                    >
                        <path d="M0,120 C240,60 480,60 720,80 C960,100 1200,40 1440,60 L1440,120 Z" />
                    </svg>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 relative z-10 bg-blue-50/50">
                <div className="container mx-auto px-6 py-12">
                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Upcoming Exams */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-100/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        Examens à Venir
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Prochaines échéances
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-800">
                                            Mathématiques
                                        </span>
                                        <span className="text-red-600 text-sm">
                                            Dans 3 jours
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-800">
                                            Histoire
                                        </span>
                                        <span className="text-orange-600 text-sm">
                                            Dans 1 semaine
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Objectives */}
                        <div className="md:col-span-1 lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-100/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        Tes Objectifs
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Progresse vers tes buts
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-gray-800">
                                            Terminer 5 cours
                                        </span>
                                        <span className="text-blue-600 text-sm">
                                            3/5
                                        </span>
                                    </div>
                                    <div className="w-full bg-blue-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: "60%" }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-gray-800">
                                            50h d&apos;étude
                                        </span>
                                        <span className="text-green-600 text-sm">
                                            45/50h
                                        </span>
                                    </div>
                                    <div className="w-full bg-green-200 rounded-full h-2">
                                        <div
                                            className="bg-green-600 h-2 rounded-full"
                                            style={{ width: "90%" }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-100/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        Activité Récente
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Tes dernières actions
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                                    <div className="flex items-center gap-3">
                                        <Star className="w-5 h-5 text-purple-600" />
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                Cours complété
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                Algèbre linéaire - Il y a 2h
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                Nouveau cours démarré
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                Géométrie - Hier
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                    <div className="flex items-center gap-3">
                                        <Trophy className="w-5 h-5 text-green-600" />
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                Badge obtenu
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                Mathématicien - Il y a 3 jours
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
