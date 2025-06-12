import { CounterBadge } from "@/components/badge/CounterBadge";
import { ExamCard } from "@/components/card/ExamCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Plus, Calendar, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { ExamDialog } from "../../exams/ExamDialog";

export type ExamProps = {
  exams: unknown[];
  courseId?: string;
  createExam?: (courseId: string, title: string, description: string, date: Date) => void;
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
  deleteExam
}: ExamProps) => {
  const typedExams = exams as ExamData[];

  const [showExam, setShowExam] = useState<ExamData | null>(
    typedExams && typedExams.length > 0 ? typedExams[0] : null
  );

  // Update showExam when exams data changes
  useEffect(() => {
    if (typedExams && typedExams.length > 0 && !showExam) {
      setShowExam(typedExams[0]);
    }
  }, [typedExams, showExam]);

  const getArrayForShowExamInExams = () => {
    if (!showExam || !typedExams) return -1;
    return typedExams.findIndex((exam) => exam.examId === showExam.examId);
  };

  const handleUpdateShowExam = (index: number) => {
    if (typedExams && typedExams[index]) {
      setShowExam(typedExams[index]);
    }
  };

  if (!typedExams || typedExams.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex flex-col h-full border-0 shadow-lg hover:shadow-xl transition-all duration-200">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-base font-semibold text-gray-800">Examens prévus</h3>
        </div>
        
        {/* Empty State */}
        <div className="flex flex-col items-center justify-center gap-3 h-full text-center">
          <div className="p-3 bg-blue-50 rounded-2xl">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 mb-1">
              Aucun examen prévu
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Ajoute ton premier examen pour commencer à réviser.
            </p>
            {createExam && courseId && getExams && updateCourseData && deleteExam ? (
              <ExamDialog
                courseId={courseId}
                createExam={createExam}
                getExams={getExams}
                updateCourseData={updateCourseData}
                deleteExam={deleteExam}
              />
            ) : (
              <Button
                disabled
                className="h-9 bg-gray-300 text-gray-500 font-medium rounded-xl text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un examen
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!showExam) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex flex-col h-full border-0 shadow-lg hover:shadow-xl transition-all duration-200">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex flex-col h-full border-0 shadow-lg hover:shadow-xl transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-base font-semibold text-gray-800">Examens prévus</h3>
          <CounterBadge counter={typedExams.length} />
        </div>
        {createExam && courseId && getExams && updateCourseData && deleteExam ? (
          <ExamDialog
            courseId={courseId}
            createExam={createExam}
            getExams={getExams}
            updateCourseData={updateCourseData}
            deleteExam={deleteExam}
          />
        ) : (
          <Button
            disabled
            className="h-8 bg-gray-300 text-gray-500 border border-gray-300 font-medium rounded-xl text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Ajouter
          </Button>
        )}
      </div>

      {/* Carousel */}
      <div className="flex items-center justify-between gap-2 flex-1">
        <Button
          onClick={() => handleUpdateShowExam(getArrayForShowExamInExams() - 1)}
          className="h-8 w-8 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/60 hover:border-blue-300 rounded-xl transition-all duration-200"
          size="icon"
          variant="ghost"
          disabled={getArrayForShowExamInExams() === 0}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        {/* Exam Card */}
        <div className="flex-1 max-w-[200px]">
          <ExamCard exam={showExam} />
        </div>
        
        <Button
          onClick={() => handleUpdateShowExam(getArrayForShowExamInExams() + 1)}
          className="h-8 w-8 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/60 hover:border-blue-300 rounded-xl transition-all duration-200"
          size="icon"
          variant="ghost"
          disabled={getArrayForShowExamInExams() >= typedExams.length - 1}
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mt-3">
        {typedExams.map((exam, index) => (
          <button
            key={index}
            onClick={() => handleUpdateShowExam(index)}
            className={`rounded-full w-2 h-2 transition-all duration-200 ${
              getArrayForShowExamInExams() === index
                ? "bg-blue-600 scale-125"
                : "bg-blue-300 hover:bg-blue-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
