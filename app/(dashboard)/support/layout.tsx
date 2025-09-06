import { ReactNode } from "react";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
    title: "Support et Aide - Edukai",
    description: "Besoin d'aide ? Consultez notre documentation, FAQ et contactez notre équipe support pour toute question sur Edukai.",
});

export default function SupportLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}