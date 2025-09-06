import { ReactNode } from "react";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
    title: "Générer un cours - Edukai",
    description: "Créez automatiquement des quiz et fiches de révision à partir de vos documents PDF, images et cours. L'IA analyse et génère du contenu personnalisé.",
});

export default function GenerateLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}