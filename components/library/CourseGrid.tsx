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
            <div className="w-full overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-48 bg-gray-100 rounded-xl animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="w-full overflow-hidden">
                <div className="text-center py-8 lg:py-16 px-4">
                    <div className="mx-auto w-16 h-16 lg:w-24 lg:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 lg:mb-6">
                        <BookOpen className="w-8 h-8 lg:w-12 lg:h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">
                        Aucun cours trouvé
                    </h3>
                    <p className="text-sm lg:text-base text-gray-500 max-w-md mx-auto mb-4 lg:mb-6 leading-relaxed">
                        Il semblerait qu&apos;aucun cours ne corresponde à vos
                        critères de recherche. Essayez de modifier vos filtres ou
                        votre recherche.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs lg:text-sm text-gray-400">
                        <Search className="w-4 h-4 flex-shrink-0" />
                        <span className="text-center">
                            Astuce : Utilisez la barre de recherche pour trouver des
                            cours spécifiques
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {courses.map((course, index) => (
                    <div
                        key={course.id}
                        className="animate-in fade-in-50 slide-in-from-bottom-4 w-full"
                        style={{
                            animationDelay: `${index * 100}ms`,
                            animationFillMode: "both",
                        }}
                    >
                        <CourseCard {...course} />
                    </div>
                ))}
            </div>
        </div>
    );
};
