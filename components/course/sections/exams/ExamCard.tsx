"use client";

import { getDaysLeft } from "@/lib/date-format";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock } from "lucide-react";
import { useState } from "react";
import { ExamDialog } from "./ExamDialog";

export type ExamCardProps = {
    exam: {
        _id: string;
        title: string;
        description: string;
        date: string | Date;
    };
    updateExam: (examId: string, data: Record<string, unknown>) => void;
    getExams: (courseId: string[]) => void;
    updateCourseData: () => void;
    courseId: string;
    isEditing?: boolean;
    createExam: (
        courseId: string,
        title: string,
        description: string,
        date: Date
    ) => void;
    deleteExam: (examId: string, courseId: string) => void;
};

export const ExamCard = ({
    exam,
    updateExam,
    getExams,
    updateCourseData,
    courseId,
    createExam,
    deleteExam,
}: ExamCardProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const daysLeft = getDaysLeft(exam.date);
    const isUrgent = daysLeft <= 7 && daysLeft >= 0;
    const isPassed = daysLeft < 0;
    const isToday = daysLeft === 0;

    // Determine styling based on status
    const getStatusStyles = () => {
        if (isPassed) {
            return {
                badgeBg: "bg-gray-500",
                badgeText: "Passé",
                numberColor: "text-gray-700",
                labelColor: "text-gray-600",
            };
        }
        if (isToday) {
            return {
                badgeBg: "bg-orange-500 animate-pulse",
                badgeText: "Aujourd'hui !",
                numberColor: "text-orange-700",
                labelColor: "text-orange-600",
            };
        }
        if (isUrgent) {
            return {
                badgeBg: "bg-red-500 animate-pulse",
                badgeText: "Urgent",
                numberColor: "text-red-700",
                labelColor: "text-red-600",
            };
        }
        return {
            badgeBg: null,
            badgeText: null,
            numberColor: "text-blue-700",
            labelColor: "text-gray-600",
        };
    };

    const styles = getStatusStyles();

    const handleCardClick = () => {
        if (!isDialogOpen) {
            setIsDialogOpen(true);
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-full">
            <div
                className="relative w-full h-full bg-white rounded-lg shadow-lg border border-[#E3E3E7] overflow-hidden flex flex-col hover:shadow-xl transition-all duration-200 cursor-pointer"
                onClick={handleCardClick}
            >
                {/* Status Badge */}
                {styles.badgeBg && styles.badgeText && (
                    <div className="absolute top-3 right-3 z-10">
                        <div
                            className={`${styles.badgeBg} text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md`}
                        >
                            {styles.badgeText}
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                    <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <p className="text-xs font-semibold text-gray-700 truncate">
                        {exam.title}
                    </p>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-hidden p-8 flex flex-col items-center justify-center min-h-[300px]">
                    {/* Days Counter */}
                    <div
                        className={`text-7xl sm:text-8xl font-black ${styles.numberColor} mb-4`}
                    >
                        {Math.abs(daysLeft)}
                    </div>

                    {/* Label */}
                    <div
                        className={`flex items-center gap-2 ${styles.labelColor} mb-4`}
                    >
                        <Clock className="w-5 h-5" />
                        <span className="text-base font-semibold">
                            {isPassed
                                ? `jour${Math.abs(daysLeft) > 1 ? "s" : ""} passé${Math.abs(daysLeft) > 1 ? "s" : ""}`
                                : isToday
                                  ? "C'est aujourd'hui !"
                                  : `jour${daysLeft > 1 ? "s" : ""} restant${daysLeft > 1 ? "s" : ""}`}
                        </span>
                    </div>

                    {/* Description if exists */}
                    {exam.description && (
                        <p className="text-sm text-gray-600 text-center mt-4 line-clamp-3 max-w-xs">
                            {exam.description}
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                    <p className="text-[10px] text-gray-400 text-center">
                        {format(new Date(exam.date), "EEEE d MMMM yyyy", {
                            locale: fr,
                        })}
                    </p>
                </div>
            </div>

            {/* Dialog */}
            <ExamDialog
                courseId={courseId}
                exam={{
                    ...exam,
                    date: new Date(exam.date),
                }}
                isEditing={true}
                createExam={createExam}
                updateExam={updateExam}
                getExams={getExams}
                updateCourseData={updateCourseData}
                deleteExam={deleteExam}
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </div>
    );
};
