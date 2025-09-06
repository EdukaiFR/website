import { ReactNode } from "react";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
    title: "Bibliothèque de cours - Edukai",
    description: "Accédez à tous vos cours et supports d'apprentissage. Générez des quiz et fiches de révision personnalisés avec l'IA.",
});

export default function LibraryLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}