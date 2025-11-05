import { CounterBadge } from "@/components/badge/CounterBadge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Calendar, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { ExamCard } from "../../exams/ExamCard";
import { ExamDialog } from "../../exams/ExamDialog";

export type ExamProps = {
    exams: unknown[];
    courseId?: string;
    createExam?: (
        courseId: string,
        title: string,
        description: string,
        date: Date
    ) => void;
    getExams?: (courseId: string[]) => void;
    updateCourseData?: () => void;
    updateExam?: (examId: string, data: unknown) => void;
    deleteExam?: (examId: string) => void;
};

type ExamData = {
    examId: number;
    title: string;
    description?: string;
    date: Date;
};

export const Exam = ({
    exams,
    courseId,
    createExam,
    getExams,
    updateCourseData,
    updateExam,
    deleteExam,
}: ExamProps) => {
    const typedExams = exams as ExamData[];
    const [currentIndex, setCurrentIndex] = useState(0);

    // Update current index when exams data changes
    useEffect(() => {
        if (typedExams && typedExams.length > 0) {
            setCurrentIndex(0);
        }
    }, [typedExams]);

    // Ensure currentIndex is within bounds
    useEffect(() => {
        if (currentIndex >= typedExams.length) {
            setCurrentIndex(Math.max(0, typedExams.length - 1));
        }
    }, [currentIndex, typedExams.length]);

    const currentExam =
        typedExams && typedExams.length > 0 ? typedExams[currentIndex] : null;

    const handlePrevious = () => {
        setCurrentIndex(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex(prev => Math.min(typedExams.length - 1, prev + 1));
    };

    const handleDotClick = (index: number) => {
        setCurrentIndex(index);
    };

    if (!typedExams || typedExams.length === 0) {
        return (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex flex-col min-h-full border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-base font-semibold text-gray-800">
                            Examens prévus
                        </span>
                    </div>

                    {/* Action Button - Full width on mobile, auto on desktop */}
                    {createExam &&
                    courseId &&
                    getExams &&
                    updateCourseData &&
                    deleteExam ? (
                        <div className="w-full lg:w-auto lg:flex-shrink-0">
                            <ExamDialog
                                courseId={courseId}
                                createExam={createExam}
                                getExams={getExams}
                                updateCourseData={updateCourseData}
                                deleteExam={deleteExam}
                            />
                        </div>
                    ) : (
                        <Button
                            disabled
                            className="w-full lg:w-auto h-10 bg-gray-300 text-gray-500 border border-gray-300 font-medium rounded-xl text-sm lg:flex-shrink-0"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter un examen
                        </Button>
                    )}
                </div>

                {/* Empty State */}
                <div className="flex flex-col items-center justify-center gap-3 flex-1 text-center py-6">
                    <div className="p-3 bg-blue-50 rounded-2xl">
                        <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800 mb-1">
                            Aucun examen prévu
                        </p>
                        <p className="text-xs text-gray-600">
                            Ajoute un examen pour mieux organiser tes révisions.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentExam) {
        return (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex flex-col min-h-full border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="flex items-center justify-center flex-1">
                    <p className="text-gray-500">Chargement...</p>
                </div>
            </div>
        );
    }

    // Convert currentExam to match the ExamCard props format (only after null check)
    const formattedExam = {
        _id: currentExam.examId?.toString() || "temp-id",
        title: currentExam.title || "",
        description: currentExam.description || "",
        date: currentExam.date,
    };

    return (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex flex-col min-h-full border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base font-semibold text-gray-800">
                        Examens prévus
                    </span>
                    <CounterBadge counter={typedExams.length} />
                </div>

                {/* Action Button - Full width on mobile, auto on desktop */}
                {createExam &&
                courseId &&
                getExams &&
                updateCourseData &&
                deleteExam ? (
                    <div className="w-full lg:w-auto lg:flex-shrink-0">
                        <ExamDialog
                            courseId={courseId}
                            createExam={createExam}
                            getExams={getExams}
                            updateCourseData={updateCourseData}
                            deleteExam={deleteExam}
                        />
                    </div>
                ) : (
                    <Button
                        disabled
                        className="w-full lg:w-auto h-10 bg-gray-300 text-gray-500 border border-gray-300 font-medium rounded-xl text-sm lg:flex-shrink-0"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter un examen
                    </Button>
                )}
            </div>

            {/* Carousel */}
            <div className="flex items-center justify-between gap-2 flex-1 min-h-0">
                <Button
                    onClick={handlePrevious}
                    className="h-8 w-8 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/60 hover:border-blue-300 rounded-xl transition-all duration-200 flex-shrink-0"
                    size="icon"
                    variant="ghost"
                    disabled={currentIndex === 0}
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>

                {/* Exam Card - Using the exact same component from exams section */}
                <div className="flex-1 min-w-0 overflow-hidden">
                    {courseId &&
                    createExam &&
                    updateExam &&
                    getExams &&
                    updateCourseData &&
                    deleteExam ? (
                        <ExamCard
                            exam={formattedExam}
                            courseId={courseId}
                            updateExam={updateExam}
                            getExams={getExams}
                            updateCourseData={updateCourseData}
                            createExam={createExam}
                            deleteExam={deleteExam}
                        />
                    ) : (
                        <div className="text-center text-gray-500">
                            Fonctions non disponibles
                        </div>
                    )}
                </div>

                <Button
                    onClick={handleNext}
                    className="h-8 w-8 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/60 hover:border-blue-300 rounded-xl transition-all duration-200 flex-shrink-0"
                    size="icon"
                    variant="ghost"
                    disabled={currentIndex >= typedExams.length - 1}
                >
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2 mt-3 flex-shrink-0">
                {typedExams.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`rounded-full w-2 h-2 transition-all duration-200 ${
                            currentIndex === index
                                ? "bg-blue-600 scale-125"
                                : "bg-blue-300 hover:bg-blue-400"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};
