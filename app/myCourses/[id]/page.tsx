"use client";

import { ExamCard } from "@/app/components/MyCourse/[id]/ExamCard";
import { FileSection } from "@/app/components/MyCourse/[id]/FileSection";
import {
  InsightsCardAccent,
  InsightsCardPrimary,
} from "@/app/components/MyCourse/[id]/InsightsCard";
import { QuizSection } from "@/app/components/MyCourse/[id]/Quiz/QuizSection";
import { ResumeSection } from "@/app/components/MyCourse/[id]/Resume/ResumeSection";
import { CreateExam } from "@/app/components/MyCourse/createExam";
import { useQuiz } from "@/app/hooks";
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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useCourse } from "@/app/hooks";
import {
  useCourseService,
  useInsightsService,
  useQuizService,
} from "@/services";

// Temporary test data for the course
import course from "@/app/json/testData/course.json";

// Temporary test data for the quiz

export default function myCoursesPage() {
  const params = useParams();
  const courseId = params?.id?.toString() || "";
  const router = useRouter();

  const [isResumeFilesVisible, setIsResumeFilesVisible] =
    useState<boolean>(false);
  const [isQuestionsVisible, setIsQuestionsVisible] = useState<boolean>(false);
  const [files, setFiles] = useState(course.files);
  const [resumeFiles, setResumeFiles] = useState(course.resumeFiles.files);
  const [quizId, setQuizId] = useState("");

  const courseService = useCourseService();
  const { courseData, loadCourse } = useCourse(courseService);

  const quizService = useQuizService();
  const insightsService = useInsightsService();
  const { quizData, insightsData, loadQuiz, getQuizInsights } = useQuiz(
    quizService,
    insightsService
  );

  useEffect(() => {
    if (courseId) {
      loadCourse(courseId);
    }
  }, [courseId]);

  useEffect(() => {
    fetchQuiz();
  }, [courseData, isQuestionsVisible]);

  // For now we handle only the first quiz of the course
  const fetchQuiz = async () => {
    if (courseData && courseData.quizzes.length > 0) {
      const quizId = courseData.quizzes[0];
      setQuizId(quizId);
      const quizResponse = await loadQuiz(quizId);
      if (quizResponse.insights.length > 0) {
        await getQuizInsights(quizId);
      }
    }
  };

  const generatorRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/generator");
  };
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
            onClick={generatorRedirect}
          >
            <ArrowLeft className="w-64 h-64" />
          </Button>

          {/* Title */}
          <h1 className="text-xl lg:text-3xl">{courseData?.title}</h1>

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
            disabled={!courseData?.quizzes.length}
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
            {courseData?.level}
          </Badge>
          <Badge className="flex items-center justify-center gap-2 outfit-regular text-sm text-accent-500 px-3 py-1 rounded-full bg-accent-500 bg-opacity-25 hover:bg-accent-500 hover:bg-opacity-25 whitespace-nowrap">
            {courseData?.subject}
          </Badge>
        </div>

        {/* Nb questions & Nb resume files */}
        <div className="flex items-center justify-start gap-8 ml-[2%] lg:ml-[3.5%]">
          {/* Quizz */}
          <div className="flex items-center justify-start gap-3">
            <Brain className="text-primary-500" size={24} />
            <p className="text-white text-opacity-75 outfit-regular text-sm">
              {quizData ? quizData.length : 0} questions
            </p>
          </div>
          {/* Resume Files */}
          <div className="flex items-center justify-start gap-3">
            <BookCheck className="text-primary-500" size={24} />
            <p className="text-white text-opacity-75 outfit-regular text-sm">
              {courseData?.resumeFiles.length}{" "}
              {(courseData?.resumeFiles?.length as number) === 1
                ? "fiche"
                : "fiches"}
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
                  value={insightsData ? insightsData.averageScore : 0}
                  unit="%"
                  base={insightsData ? insightsData.insightsCount : 0}
                />
                <InsightsCardPrimary
                  title="Taux de réussite moyen"
                  value={course.insights.averageWinRate.score}
                  unit="%"
                  base={course.insights.averageWinRate.nbPersons}
                />
              </div>
            </div>
            {/* Exams */}
            <div className="p-3 flex flex-col items-start gap-4 bg-primary bg-opacity-25 rounded-lg w-full">
              {/* Header */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between w-full">
                <div className="flex flex-col items-start gap-1 w-full">
                  <p className="text-md text-white outfit-regular">
                    Examens Prévus
                  </p>
                  <p className="text-xs lg:text-sm text-white text-opacity-75 outfit-regular mr-auto w-full">
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

                <div className="mt-2 lg:mt-0 ml-auto">
                  {" "}
                  {/* Add ml-auto here */}
                  <CreateExam examList={exams} ctaAddExam={setExams} />
                </div>
              </div>

              {/* Cards */}
              <div className="flex flex-col lg:flex-row lg:flex-wrap items-center justify-between gap-4 w-full">
                {exams.map((exam, index) => (
                  <ExamCard
                    exam={exam}
                    key={index}
                    ctaSetExam={setExams}
                    examsList={exams}
                  />
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
          <QuizSection
            quizId={quizId}
            quiz={quizData}
            setIsQuizVisible={setIsQuestionsVisible}
          />
        </div>
      )}
    </div>
  );
}
