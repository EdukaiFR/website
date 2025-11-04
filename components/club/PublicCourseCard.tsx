"use client";

import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap } from "lucide-react";
import { PublicContentCard } from "./PublicContentCard";

export type PublicCourseCardProps = {
    id: string;
    title: string;
    subject: string;
    level: string;
    author: {
        firstName: string;
        lastName: string;
        username: string;
    };
    createdAt: string;
};

const getSubjectColor = (subject: string) => {
    const colors = {
        Mathématiques: "bg-blue-100 text-blue-800 border-blue-200",
        Physique: "bg-purple-100 text-purple-800 border-purple-200",
        Chimie: "bg-green-100 text-green-800 border-green-200",
        Biologie: "bg-emerald-100 text-emerald-800 border-emerald-200",
        Histoire: "bg-orange-100 text-orange-800 border-orange-200",
        Géographie: "bg-yellow-100 text-yellow-800 border-yellow-200",
        Français: "bg-red-100 text-red-800 border-red-200",
        Anglais: "bg-indigo-100 text-indigo-800 border-indigo-200",
        Espagnol: "bg-pink-100 text-pink-800 border-pink-200",
        Philosophie: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return (
        colors[subject as keyof typeof colors] ||
        "bg-gray-100 text-gray-800 border-gray-200"
    );
};

const getLevelColor = (level: string) => {
    const colors = {
        Sixième: "bg-emerald-50 text-emerald-700",
        Cinquième: "bg-teal-50 text-teal-700",
        Quatrième: "bg-cyan-50 text-cyan-700",
        Troisième: "bg-blue-50 text-blue-700",
        Seconde: "bg-indigo-50 text-indigo-700",
        Première: "bg-purple-50 text-purple-700",
        Terminale: "bg-pink-50 text-pink-700",
        TERMIIIIINALE: "bg-pink-50 text-pink-700",
    };
    return (
        colors[level as keyof typeof colors] || "bg-gray-50 text-gray-700"
    );
};

export const PublicCourseCard = ({
    id,
    title,
    subject,
    level,
    author,
    createdAt,
}: PublicCourseCardProps) => {
    const badges = (
        <>
            <Badge
                variant="secondary"
                className={`${getSubjectColor(subject)} text-xs font-medium border transition-all group-hover:shadow-sm`}
            >
                {subject}
            </Badge>
            <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-gray-400" />
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(level)} transition-all group-hover:shadow-sm whitespace-nowrap`}
                >
                    {level}
                </span>
            </div>
        </>
    );

    return (
        <PublicContentCard
            title={title}
            author={author}
            createdAt={createdAt}
            href={`/library/${id}`}
            icon={BookOpen}
            iconColor="blue"
            badges={badges}
            actionText="Voir le cours"
        />
    );
};
