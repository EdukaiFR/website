import { CounterBadge } from "@/components/badge/CounterBadge";
import { ExamCard } from "@/components/card/ExamCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { useState } from "react";

export type ExamProps = {
  exams: any[];
};

export const Exam = ({ exams }: ExamProps) => {
  const [showExam, setShowExam] = useState(exams[0]);

  const getArrayForShowExamInExams = () => {
    return exams.findIndex((exam) => exam.examId === showExam.examId);
  };

  const handleAddExam = async () => {
    try {
      // Add exam logic
      console.log("Add exam process start");
    } catch (error: any) {
      console.error("Add exam error: ", error.message);
    }
  };

  const handleUpdateShowExam = (index: number) => {
    setShowExam(exams[index]);
  };

  return (
    <div className="bg-white rounded-lg p-4 flex flex-col items-start justify-between gap-3 h-full satoshi-medium ">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center justify-start gap-3">
          <h3 className="text-lg text-[#3C517C]">Examen prévu</h3>
          <CounterBadge counter={exams.length} />
        </div>
        <Button
          onClick={handleAddExam}
          variant={"ghost"}
          className="text-[#2D6BCF] text-sm hover:bg-[#2D6BCF]/10 hover:text-[#2D6BCF] rounded-full px-3 py-1 flex items-center gap-1"
        >
          <Plus size={16} />
          Ajouter
        </Button>
      </div>
      <div className="flex items-center justify-between gap-2 text-sm w-full">
        <Button
          onClick={() => handleUpdateShowExam(getArrayForShowExamInExams() - 1)}
          className="text-[#2D6BCF] text-sm hover:bg-[#2D6BCF]/10 hover:text-[#2D6BCF] rounded-full px-3 py-1 flex items-center gap-1"
          size={"icon"}
          variant={"ghost"}
          disabled={getArrayForShowExamInExams() === 0}
        >
          <ArrowLeft />
        </Button>
        {/* Exam Carrousel */}
        <ExamCard exam={showExam} />
        <Button
          onClick={() => handleUpdateShowExam(getArrayForShowExamInExams() + 1)}
          className="text-[#2D6BCF] text-sm hover:bg-[#2D6BCF]/10 hover:text-[#2D6BCF] rounded-full px-3 py-1 flex items-center gap-1"
          size={"icon"}
          variant={"ghost"}
          disabled={getArrayForShowExamInExams() >= exams.length - 1}
        >
          <ArrowRight />
        </Button>
      </div>
      <div className="flex items-center justify-center gap-3 w-full mt-auto">
        {exams.map((exam, index) => (
          <div
            key={index}
            onClick={() => handleUpdateShowExam(index)}
            className={
              `rounded-full w-2 h-2 cursor-pointer transition-all ` +
              (getArrayForShowExamInExams() === index
                ? "bg-[#2D6BCF]"
                : "bg-[#2D6BCF] bg-opacity-25")
            }
          ></div>
        ))}
      </div>
    </div>
  );
};
