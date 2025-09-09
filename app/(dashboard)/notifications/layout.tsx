import { ReactNode } from "react";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
    title: "Notifications - Edukai",
    description:
        "Consultez vos notifications et restez informé de vos activités d'apprentissage sur Edukai.",
    noIndex: true,
});

export default function NotificationsLayout({
    children,
}: {
    children: ReactNode;
}) {
    return <>{children}</>;
}
