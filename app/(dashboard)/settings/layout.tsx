import { ReactNode } from "react";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
    title: "Paramètres - Edukai",
    description: "Gérez votre profil, vos préférences et votre abonnement Edukai. Personnalisez votre expérience d'apprentissage.",
    noIndex: true,
});

export default function SettingsLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}