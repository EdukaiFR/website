"use client";

import { FileText } from "lucide-react";
import { PublicContentCard } from "./PublicContentCard";

export type PublicSheetCardProps = {
    id: string;
    title?: string;
    author: {
        firstName: string;
        lastName: string;
        username: string;
    };
    createdAt: string;
};

export const PublicSheetCard = ({
    id,
    title,
    author,
    createdAt,
}: PublicSheetCardProps) => {
    const sheetTitle = title || `Fiche de révision`;

    const badges = (
        <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
            Fiche de révision
        </span>
    );

    return (
        <PublicContentCard
            title={sheetTitle}
            author={author}
            createdAt={createdAt}
            href={`/summary-sheets/${id}`}
            icon={FileText}
            iconColor="purple"
            badges={badges}
            actionText="Voir la fiche"
        />
    );
};
