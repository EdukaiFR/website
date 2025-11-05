import { WandSparkles } from "lucide-react";

export function GeneratorHeader() {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 p-8 text-white shadow-xl">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                        <WandSparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                        Générateur IA
                    </div>
                </div>
                <h1 className="text-xl lg:text-2xl font-bold mb-2">
                    Bienvenue dans le générateur
                </h1>
                <p className="text-blue-100 text-base lg:text-lg max-w-2xl">
                    Remplis les champs ci-dessous puis clique sur 'Lancer
                    la génération'.
                </p>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 right-8 w-20 h-20 bg-purple-300/20 rounded-full blur-lg"></div>
        </div>
    );
}
