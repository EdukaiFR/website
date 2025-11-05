"use client";

import { BookOpen, Search } from "lucide-react";
import { CourseCard, CourseCardProps } from "./CourseCard";

interface CourseGridProps {
    courses: CourseCardProps[];
    isLoading?: boolean;
}

export const CourseGrid = ({ courses, isLoading = false }: CourseGridProps) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-48 bg-gray-100 rounded-xl animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="text-center py-16 px-4">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Aucun cours trouvé
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Il semblerait qu'aucun cours ne corresponde à vos
                    critères de recherche. Essayez de modifier vos filtres ou
                    votre recherche.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                    <Search className="w-4 h-4" />
                    <span>
                        Astuce : Utilisez la barre de recherche pour trouver des
                        cours spécifiques
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course, index) => (
                <div
                    key={course.id}
                    className="animate-in fade-in-50 slide-in-from-bottom-4"
                    style={{
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: "both",
                    }}
                >
                    <CourseCard {...course} />
                </div>
            ))}
        </div>
    );
};
