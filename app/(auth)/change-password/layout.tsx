import { ReactNode } from "react";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
    title: "Changer le mot de passe - Edukai",
    description:
        "Modifiez votre mot de passe Edukai en toute sécurité. Protégez votre compte et vos données d'apprentissage.",
    noIndex: true, // Password pages shouldn't be indexed
});

export default function ChangePasswordLayout({
    children,
}: {
    children: ReactNode;
}) {
    return <>{children}</>;
}
