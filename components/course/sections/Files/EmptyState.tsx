import { Card, CardContent } from "@/components/ui/card";
import { File } from "lucide-react";

interface EmptyStateProps {
    type: "loading" | "error" | "empty";
    message?: string;
}

export default function EmptyState({ type, message }: EmptyStateProps) {
    if (type === "loading") {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des fichiers...</p>
                </div>
            </div>
        );
    }

    if (type === "error") {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-2">Erreur</p>
                    <p className="text-gray-600">{message}</p>
                </div>
            </div>
        );
    }

    return (
        <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-full blur-3xl"></div>
                    <div className="relative p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl inline-block mb-6">
                        <File className="w-16 h-16 text-slate-400" />
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                    Aucun fichier trouvé
                </h3>
                <p className="text-slate-500">
                    Ce cours ne contient pas encore de fichiers
                </p>
            </CardContent>
        </Card>
    );
}
