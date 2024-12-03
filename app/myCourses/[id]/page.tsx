"use client";

import { ExamCard } from "@/app/components/MyCourse/[id]/ExamCard";
import { FileSection } from "@/app/components/MyCourse/[id]/FileSection";
import {
  InsightsCardAccent,
  InsightsCardPrimary,
} from "@/app/components/MyCourse/[id]/InsightsCard";
import { QuizzSection } from "@/app/components/MyCourse/[id]/Quizz/QuizzSection";
import { ResumeSection } from "@/app/components/MyCourse/[id]/Resume/ResumeSection";
import { CreateExam } from "@/app/components/MyCourse/createExam";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BicepsFlexed,
  BookCheck,
  Brain,
  CircleStop,
  Eye,
  EyeOff,
} from "lucide-react";
import { useEffect, useState } from "react";

// Temporary test data for the course
import course from "@/app/json/testData/course.json";

// Temporary test data for the quiz
import { tempData } from "@/app/hooks";

export default function myCoursesPage({ params }: { params: { id: string } }) {
  const { id } = params;
  console.log(id);

  const [isResumeFilesVisible, setIsResumeFilesVisible] =
    useState<boolean>(false);
  const [isQuestionsVisible, setIsQuestionsVisible] = useState<boolean>(false);
  const [files, setFiles] = useState(course.files);
  const [resumeFiles, setResumeFiles] = useState(course.resumeFiles.files);
  const [quiz, setQuiz] = useState(tempData);
  const [exams, setExams] = useState<any[]>([]);

  const updateFile = (updatedFiles: any[]) => {
    setResumeFiles(updatedFiles);
  };

  const updateResumeFile = (updatedFiles: any[]) => {
    setFiles(updatedFiles);
  };

  useEffect(() => {
    if (isQuestionsVisible && isResumeFilesVisible) {
      setIsResumeFilesVisible(false);
    }
  }, [isQuestionsVisible]);

  useEffect(() => {
    if (isQuestionsVisible && isResumeFilesVisible) {
      setIsQuestionsVisible(false);
    }
  }, [isResumeFilesVisible]);

  return (
    <div className="w-full flex flex-col gap-2 items-start justify-start mb-auto mt-[4%]">
      {/* Header */}
      <div className="flex flex-col gap-3 items-start w-full">
        {/* Go Back, Title & CTA */}
        <div className="w-full flex flex-wrap items-center gap-2 lg:gap-4 text-white outfit-refular">
          {/* Go back */}
          <Button
            variant={"ghost"}
            size={"icon"}
            className="transition-all px-2 py-2 hover:bg-primary-200 hover:bg-opacity-25 rounded-full border-none scale-125 !shadow-none hover:rotate-6 hover:scale-125"
            onClick={() => console.log("Go back to the previous page")}
          >
            <ArrowLeft className="w-64 h-64" />
          </Button>

          {/* Title */}
          <h1 className="text-xl lg:text-3xl">{course.title}</h1>

          {/* CTA */}
          <Button
            variant={"outline"}
            size={"lg"}
            className="px-[3%] ml-auto bg-transparent border-2 border-white text-white outfit-regular text-sm rounded-full hover:bg-white hover:bg-opacity-10 w-full lg:w-auto"
            onClick={() => setIsResumeFilesVisible(!isResumeFilesVisible)}
          >
            {isResumeFilesVisible ? <EyeOff size={24} /> : <Eye size={24} />}
            {isResumeFilesVisible ? "Masquer" : "Voir"} les fiches résumés
          </Button>
          <Button
            size={"lg"}
            className="px-[3%] text-white rounded-full text-sm outfit-regular w-full lg:w-auto"
            onClick={() => setIsQuestionsVisible(!isQuestionsVisible)}
          >
            {isQuestionsVisible ? (
              <CircleStop size={24} />
            ) : (
              <BicepsFlexed size={24} />
            )}
            {isQuestionsVisible ? "Arrêter le quiz" : "Lancer un quiz"}
          </Button>
        </div>

        {/* Course informations */}
        <div className="flex items-center justify-start gap-3 ml-[2%] lg:ml-[3.5%]">
          <p className="text-white text-opacity-75 text-xs lg:text-sm outfit-regular">
            Créé par:{" "}
            <span className="underline-offset-4">{course.creator}</span>
          </p>

          <Badge className="ml-6 flex items-center justify-center gap-2 outfit-regular text-sm text-primary-500 px-3 py-1 rounded-full bg-primary-500 bg-opacity-25 hover:bg-primary-500 hover:bg-opacity-25 whitespace-nowrap">
            {course.level}
          </Badge>
          <Badge className="flex items-center justify-center gap-2 outfit-regular text-sm text-accent-500 px-3 py-1 rounded-full bg-accent-500 bg-opacity-25 hover:bg-accent-500 hover:bg-opacity-25 whitespace-nowrap">
            {course.subject}
          </Badge>
        </div>

        {/* Nb questions & Nb resume files */}
        <div className="flex items-center justify-start gap-8 ml-[2%] lg:ml-[3.5%]">
          {/* Quizz */}
          <div className="flex items-center justify-start gap-3">
            <Brain className="text-primary-500" size={24} />
            <p className="text-white text-opacity-75 outfit-regular text-sm">
              {tempData.message.length} questions
            </p>
          </div>
          {/* Resume Files */}
          <div className="flex items-center justify-start gap-3">
            <BookCheck className="text-primary-500" size={24} />
            <p className="text-white text-opacity-75 outfit-regular text-sm">
              {course.resumeFiles.nbFiles}{" "}
              {course.resumeFiles.nbFiles === 1 ? "fiche" : "fiches"}
            </p>
          </div>
        </div>
      </div>

      {/* Default display */}
      {!isQuestionsVisible && !isResumeFilesVisible && (
        <>
          {/* Files Section */}
          <FileSection files={files} ctaUpdate={setFiles} />

          {/* Insights + Exams */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4 w-full max-w-[96.5%] ml-[2%] lg:ml-[3.5%] mb-5">
            {/* Insights */}
            <div className="p-3 flex flex-col items-center lg:items-start gap-4 bg-primary bg-opacity-25 rounded-lg w-full lg:max-w-[40%]">
              {/* Header */}
              <div className="flex flex-col items-center lg:items-start gap-1 w-full">
                <p className="text-md text-white outfit-regular">
                  Statistiques sur le Quizz
                </p>
                <p className="text-sm text-white text-opacity-75 outfit-regular">
                  Ton objectif de réussite est de{" "}
                  <span className="text-accent text-opacity-75">
                    {course.insights.winRateGoal}%
                  </span>
                </p>
              </div>

              {/* Cards */}
              <div className="flex flex-col lg:flex-row items-center justify-start gap-4 w-full">
                <InsightsCardAccent
                  title="Ton taux de réussite"
                  value={course.insights.winRate.score}
                  unit="%"
                  base="sur 3 essais"
                />
                <InsightsCardPrimary
                  title="Taux de réussite moyen"
                  value={course.insights.averageWinRate.score}
                  unit="%"
                  base={`sur ${course.insights.averageWinRate.nbPersons} personnes`}
                />
              </div>
            </div>
            {/* Exams */}
            <div className="p-3 flex flex-col items-start gap-4 bg-primary bg-opacity-25 rounded-lg w-full">
              {/* Header */}
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col items-start gap-1 w-full">
                  <p className="text-md text-white outfit-regular">
                    Examens Prévus
                  </p>
                  <p className="text-xs lg:text-sm text-white text-opacity-75 outfit-regular">
                    Tu {exams.length === 0 && "n'"}as{" "}
                    <span className="text-accent text-opacity-75">
                      {exams.length === 0 ? "aucun" : exams.length}
                    </span>{" "}
                    {exams.length === 0
                      ? "examen prévu"
                      : exams.length > 1
                      ? "examens prévus"
                      : "examen prévu"}{" "}
                    pour ce cours.
                  </p>
                </div>

                <CreateExam ctaAddExam={setExams} />
              </div>

              {/* Cards */}
              <div className="flex flex-col lg:flex-row lg:flex-wrap items-center justify-between gap-4 w-full">
                {exams.map((exam) => (
                  <ExamCard exam={exam} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ResumeFiles Display */}
      {isResumeFilesVisible && (
        <div className="w-full flex items-center justify-center mb-5">
          <ResumeSection
            resumeFiles={resumeFiles}
            updateResumeFile={updateFile}
          />
        </div>
      )}

      {/* Questions Display */}
      {isQuestionsVisible && (
        <div className="w-full flex items-center justify-center mb-5">
          <QuizzSection
            questions={tempData.message}
            setIsQuizzVisible={setIsQuestionsVisible}
          />
        </div>
      )}
    </div>
  );
}
