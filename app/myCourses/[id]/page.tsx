"use client";

import { ExamCard } from "@/app/components/MyCourse/[id]/ExamCard";
import { FileSection } from "@/app/components/MyCourse/[id]/FileSection";
import {
  InsightsCardAccent,
  InsightsCardPrimary,
} from "@/app/components/MyCourse/[id]/InsightsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BicepsFlexed,
  BookCheck,
  Brain,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";

// Fictive Data for the course
const course = {
  id: 1, // id of the course
  title: "Seconde Guerre Mondiale", // title of the course
  subject: "Histoire", // subject of the course
  level: "Terminal", // level of the course
  files: [
    {
      name: "Course 1.svg",
      href: "/icons/filesType/exemple.svg",
    },
    {
      name: "Course 2.svg",
      href: "/icons/filesType/exemple.svg",
    },
    {
      name: "Course 3.svg",
      href: "/icons/filesType/exemple.svg",
    },
  ], // files of the course
  quiz: {
    nbQuestions: 62,
  }, // quiz of the course
  resumeFiles: {
    nbFiles: 3,
    files: [],
  }, // resume files of the course
  creator: "Toi", // creator of the course
  creationDate: new Date(), // creation date of the course
  isPublished: false, // is the course published and available for others people
  insights: {
    winRateGoal: 95,
    averageWinRate: {
      score: 74,
      nbPersons: 12,
    },
    winRate: {
      score: 82,
      nbTry: 3,
    },
  }, // insights of the course (winRate)
  exams: [
    {
      id: 0,
      title: "Contrôle",
      daysLeft: 13,
    },
    {
      id: 1,
      title: "Bac blanc",
      daysLeft: 25,
    },
    {
      id: 2,
      title: "Bac",
      daysLeft: 61,
    },
  ], // exams of the course
};

export default function myCoursesPage({ params }: { params: { id: string } }) {
  const { id } = params;
  console.log(id);

  const [isResumeFilesVisible, setIsResumeFilesVisible] =
    useState<boolean>(false);
  const [files, setFiles] = useState(course.files);

  const updateFile = (updatedFiles: any[]) => {
    setFiles(updatedFiles); // Met à jour les fichiers dynamiquement
  };

  return (
    <div className="w-full flex flex-col gap-2 items-start justify-start mb-auto mt-[4%]">
      {/* Header */}
      <div className="flex flex-col gap-3 items-start w-full">
        {/* Go Back, Title & CTA */}
        <div className="w-full flex items-center gap-4 text-white outfit-refular">
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
          <h1 className="text-3xl">{course.title}</h1>

          {/* CTA */}
          <Button
            variant={"outline"}
            size={"lg"}
            className="px-[3%] ml-auto bg-transparent border-2 border-white text-white outfit-regular text-sm rounded-full hover:bg-white hover:bg-opacity-10"
            onClick={() => setIsResumeFilesVisible(!isResumeFilesVisible)}
          >
            {isResumeFilesVisible ? <EyeOff size={24} /> : <Eye size={24} />}
            {isResumeFilesVisible ? "Masquer" : "Voir"} les fiches résumés
          </Button>
          <Button
            size={"lg"}
            className="px-[3%] text-white rounded-full text-sm outfit-regular"
            onClick={() => console.log("Je dois lancer le quizz")}
          >
            <BicepsFlexed size={24} />
            Lancer un quiz
          </Button>
        </div>

        {/* Course informations */}
        <div className="flex items-center justify-start gap-3 ml-[3.5%]">
          <p className="text-white text-opacity-75 text-sm outfit-regular">
            Créer par:{" "}
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
        <div className="flex items-center justify-start gap-8 ml-[3.5%]">
          {/* Quizz */}
          <div className="flex items-center justify-start gap-3">
            <Brain className="text-primary-500" size={24} />
            <p className="text-white text-opacity-75 outfit-regular text-sm">
              {course.quiz.nbQuestions} questions
            </p>
          </div>
          {/* Resume Files */}
          <div className="flex items-center justify-start gap-3">
            <BookCheck className="text-primary-500" size={24} />
            <p className="text-white text-opacity-75 outfit-regular text-sm">
              {course.resumeFiles.nbFiles} fiches
            </p>
          </div>
        </div>
      </div>

      {/* Files Section */}
      <FileSection files={files} ctaUpdate={updateFile} />

      {/* Insights + Exams */}
      <div className="flex items-center justify-between gap-4 w-full max-w-[96.5%] ml-[3.5%] mb-5">
        {/* Insights */}
        <div className="p-3 flex flex-col items-start gap-4 bg-primary bg-opacity-25 rounded-lg w-full max-w-[40%]">
          {/* Header */}
          <div className="flex flex-col items-start gap-1 w-full">
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
          <div className="flex items-center justify-start gap-4 w-full">
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
          <div className="flex flex-col items-start gap-1 w-full">
            <p className="text-md text-white outfit-regular">Examen Prévu</p>
            <p className="text-sm text-white text-opacity-75 outfit-regular">
              Tu as{" "}
              <span className="text-accent text-opacity-75">
                {course.exams.length}
              </span>{" "}
              examens prévus pour ce cours
            </p>
          </div>

          {/* Cards */}
          <div className="flex items-center justify-between gap-4 w-full">
            {course.exams.map((exam) => (
              <ExamCard
                key={exam.id}
                title={exam.title}
                value={exam.daysLeft}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
