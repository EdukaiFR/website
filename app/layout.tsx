// app/layout.tsx
import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/contexts/UserContext";
import { constructMetadata, generateStructuredData } from "@/lib/seo";
import Script from "next/script";

export const metadata: Metadata = {
    ...constructMetadata(),
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
};

export default function RootLayout({ children }: { children: ReactNode }) {
    const organizationData = generateStructuredData('Organization');
    const websiteData = generateStructuredData('WebSite');
    
    return (
        <html lang="fr">
            <head>
                <Script
                    id="organization-structured-data"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
                />
                <Script
                    id="website-structured-data"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
                />
            </head>
            <body className="w-full min-h-screen font-satoshi">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    <UserProvider>
                        {children}
                    </UserProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
