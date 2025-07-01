"use client";

import { Users, Calendar, Trophy, Star, UserPlus } from "lucide-react";

export default function ClubEdukaiPage() {
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

                <div className="relative z-10 container mx-auto px-6 py-16 lg:py-24">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        {/* Left Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                                <Users className="w-5 h-5" />
                                <span className="text-sm font-medium">
                                    Communauté Étudiante
                                </span>
                            </div>

                            <h1 className="text-2xl lg:text-4xl font-bold mb-6 leading-tight">
                                Club
                                <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                                    Edukai
                                </span>
                            </h1>

                            <p className="text-base lg:text-lg text-blue-100 mb-8 max-w-2xl">
                                Rejoignez une communauté passionnée
                                d&apos;apprenants et développez vos compétences
                                ensemble dans un environnement collaboratif et
                                bienveillant.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl hover:transform hover:scale-105">
                                    <UserPlus className="w-6 h-6" />
                                    Rejoindre le Club
                                </button>
                                <button className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200">
                                    <Calendar className="w-6 h-6" />
                                    Voir les Événements
                                </button>
                            </div>
                        </div>

                        {/* Right Content - Stats Cards */}
                        <div className="flex-1 max-w-md">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Members Card */}
                                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30 transition-all duration-300 hover:bg-white/30 hover:backdrop-blur-md hover:shadow-2xl hover:shadow-white/20 hover:scale-105 hover:border-white/50 cursor-pointer group">
                                    <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:bg-yellow-400/30 group-hover:scale-110">
                                        <Users className="w-6 h-6 text-yellow-300 transition-all duration-300 group-hover:text-yellow-200" />
                                    </div>
                                    <div className="text-xl font-bold mb-1 transition-all duration-300 group-hover:scale-110">
                                        2,500+
                                    </div>
                                    <div className="text-blue-100 text-sm transition-all duration-300 group-hover:text-white">
                                        Membres Actifs
                                    </div>
                                </div>

                                {/* Events Card */}
                                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30 transition-all duration-300 hover:bg-white/30 hover:backdrop-blur-md hover:shadow-2xl hover:shadow-white/20 hover:scale-105 hover:border-white/50 cursor-pointer group">
                                    <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:bg-green-400/30 group-hover:scale-110">
                                        <Calendar className="w-6 h-6 text-green-300 transition-all duration-300 group-hover:text-green-200" />
                                    </div>
                                    <div className="text-xl font-bold mb-1 transition-all duration-300 group-hover:scale-110">
                                        150+
                                    </div>
                                    <div className="text-blue-100 text-sm transition-all duration-300 group-hover:text-white">
                                        Événements
                                    </div>
                                </div>

                                {/* Achievements Card */}
                                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30 transition-all duration-300 hover:bg-white/30 hover:backdrop-blur-md hover:shadow-2xl hover:shadow-white/20 hover:scale-105 hover:border-white/50 cursor-pointer group">
                                    <div className="w-12 h-12 bg-purple-400/20 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:bg-purple-400/30 group-hover:scale-110">
                                        <Trophy className="w-6 h-6 text-purple-300 transition-all duration-300 group-hover:text-purple-200" />
                                    </div>
                                    <div className="text-xl font-bold mb-1 transition-all duration-300 group-hover:scale-110">
                                        50+
                                    </div>
                                    <div className="text-blue-100 text-sm transition-all duration-300 group-hover:text-white">
                                        Récompenses
                                    </div>
                                </div>

                                {/* Rating Card */}
                                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30 transition-all duration-300 hover:bg-white/30 hover:backdrop-blur-md hover:shadow-2xl hover:shadow-white/20 hover:scale-105 hover:border-white/50 cursor-pointer group">
                                    <div className="w-12 h-12 bg-orange-400/20 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:bg-orange-400/30 group-hover:scale-110">
                                        <Star className="w-6 h-6 text-orange-300 transition-all duration-300 group-hover:text-orange-200" />
                                    </div>
                                    <div className="text-xl font-bold mb-1 transition-all duration-300 group-hover:scale-110">
                                        4.9
                                    </div>
                                    <div className="text-blue-100 text-sm transition-all duration-300 group-hover:text-white">
                                        Note Moyenne
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

            {/* Content Area - Ready for future content */}
            <main className="flex-1 relative z-10 bg-blue-50/50">
                <div className="container mx-auto px-6 py-12">
                    {/* Future content will go here */}
                    <div className="text-center py-20">
                        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 rounded-full px-6 py-3 text-lg font-medium">
                            <Users className="w-5 h-5" />
                            Contenu à venir
                        </div>
                        <p className="text-gray-600 mt-4 max-w-md mx-auto">
                            Cette section sera bientôt remplie avec du contenu
                            passionnant sur le Club Edukai.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
