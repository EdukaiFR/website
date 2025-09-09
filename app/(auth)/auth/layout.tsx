import { ReactNode } from "react";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
    title: "Connexion - Edukai | Révise mieux, pas plus",
    description:
        "Connectez-vous à Edukai pour accéder à votre plateforme d'apprentissage personnalisée. Générez des quiz et fiches de révision automatiquement.",
});

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-2 sm:p-4">
            <div className="w-full max-w-md lg:max-w-6xl">{children}</div>
        </main>
    );
}
