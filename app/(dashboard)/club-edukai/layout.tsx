import { ReactNode } from "react";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
    title: "Club Edukai - Communauté d'apprentissage",
    description: "Rejoignez le Club Edukai et accédez à des avantages exclusifs, des ressources premium et une communauté d'étudiants motivés.",
});

export default function ClubEdukaiLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}