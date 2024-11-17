"use client";

import { ExamCard } from "@/app/components/MyCourse/[id]/ExamCard";
import { FileSection } from "@/app/components/MyCourse/[id]/FileSection";
import {
  InsightsCardAccent,
  InsightsCardPrimary,
} from "@/app/components/MyCourse/[id]/InsightsCard";
import { QuizzSection } from "@/app/components/MyCourse/[id]/Quizz/QuizzSection";
import { ResumeSection } from "@/app/components/MyCourse/[id]/Resume/ResumeSection";
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
    nbQuestions: 10,
    questions: [
      {
        question: "Quand a eu lieu la Seconde Guerre mondiale ?",
        answers: [
          {
            answer: "1939 - 1945",
            isCorrect: true,
            explanation:
              "La guerre a débuté avec l'invasion de la Pologne en 1939 et s'est terminée en 1945 avec la capitulation de l'Allemagne et du Japon.",
          },
          {
            answer: "1914 - 1918",
            isCorrect: false,
          },
          {
            answer: "1945 - 1950",
            isCorrect: false,
          },
          {
            answer: "1940 - 1945",
            isCorrect: false,
          },
        ],
      },
      {
        question:
          "Quel événement a marqué le début de la Seconde Guerre mondiale ?",
        answers: [
          {
            answer: "L'invasion de la Pologne par l'Allemagne",
            isCorrect: true,
            explanation:
              "L'Allemagne nazie a envahi la Pologne le 1er septembre 1939, ce qui a conduit la France et le Royaume-Uni à déclarer la guerre à l'Allemagne.",
          },
          {
            answer: "L'attaque de Pearl Harbor",
            isCorrect: false,
          },
          {
            answer: "La bataille de Stalingrad",
            isCorrect: false,
          },
          {
            answer: "La capitulation de la France",
            isCorrect: false,
          },
        ],
      },
      {
        question: "Quelle alliance réunissait les forces de l'Axe ?",
        answers: [
          {
            answer: "Allemagne, Italie, Japon",
            isCorrect: true,
            explanation:
              "L'Allemagne, l'Italie et le Japon ont formé l'Axe, une alliance militaire pour dominer l'Europe et l'Asie.",
          },
          {
            answer: "France, Royaume-Uni, URSS",
            isCorrect: false,
          },
          {
            answer: "États-Unis, Royaume-Uni, Chine",
            isCorrect: false,
          },
          {
            answer: "Allemagne, URSS, Italie",
            isCorrect: false,
          },
        ],
      },
      {
        question:
          "Quel pays a rejoint les Alliés après l'attaque de Pearl Harbor ?",
        answers: [
          {
            answer: "Les États-Unis",
            isCorrect: true,
            explanation:
              "Les États-Unis ont rejoint les Alliés après que le Japon a attaqué leur base navale de Pearl Harbor le 7 décembre 1941.",
          },
          {
            answer: "Le Japon",
            isCorrect: false,
          },
          {
            answer: "L'Allemagne",
            isCorrect: false,
          },
          {
            answer: "L'Italie",
            isCorrect: false,
          },
        ],
      },
      {
        question:
          "Quelle conférence a décidé du partage de l'Allemagne après la guerre ?",
        answers: [
          {
            answer: "La conférence de Yalta",
            isCorrect: true,
            explanation:
              "En février 1945, les Alliés se sont réunis à Yalta pour organiser le partage de l'Allemagne en zones d'occupation.",
          },
          {
            answer: "La conférence de Potsdam",
            isCorrect: false,
          },
          {
            answer: "La conférence de Téhéran",
            isCorrect: false,
          },
          {
            answer: "La conférence de Munich",
            isCorrect: false,
          },
        ],
      },
      {
        question:
          "Quelle bataille est considérée comme le tournant de la guerre en Europe ?",
        answers: [
          {
            answer: "La bataille de Stalingrad",
            isCorrect: true,
            explanation:
              "La défaite allemande à Stalingrad en 1943 a marqué le début du recul des forces nazies en Europe de l'Est.",
          },
          {
            answer: "La bataille d'Angleterre",
            isCorrect: false,
          },
          {
            answer: "Le débarquement de Normandie",
            isCorrect: false,
          },
          {
            answer: "La bataille de Midway",
            isCorrect: false,
          },
        ],
      },
      {
        question: "Quelle ville a été la cible de la première bombe atomique ?",
        answers: [
          {
            answer: "Hiroshima",
            isCorrect: true,
            explanation:
              "Le 6 août 1945, les États-Unis ont largué une bombe atomique sur Hiroshima, marquant une étape clé vers la fin de la guerre.",
          },
          {
            answer: "Nagasaki",
            isCorrect: false,
          },
          {
            answer: "Tokyo",
            isCorrect: false,
          },
          {
            answer: "Osaka",
            isCorrect: false,
          },
        ],
      },
      {
        question: "Quel était le chef du gouvernement de Vichy en France ?",
        answers: [
          {
            answer: "Philippe Pétain",
            isCorrect: true,
            explanation:
              "Philippe Pétain dirigeait le régime de Vichy, un gouvernement collaborateur avec l'Allemagne nazie en France.",
          },
          {
            answer: "Charles de Gaulle",
            isCorrect: false,
          },
          {
            answer: "Léon Blum",
            isCorrect: false,
          },
          {
            answer: "Jean Moulin",
            isCorrect: false,
          },
        ],
      },
      {
        question: "Quel événement a précipité la capitulation du Japon ?",
        answers: [
          {
            answer: "Les bombes atomiques sur Hiroshima et Nagasaki",
            isCorrect: true,
            explanation:
              "Les bombes atomiques larguées sur Hiroshima et Nagasaki ont conduit le Japon à capituler en août 1945.",
          },
          {
            answer: "La bataille d'Okinawa",
            isCorrect: false,
          },
          {
            answer: "L'invasion de la Mandchourie par l'URSS",
            isCorrect: false,
          },
          {
            answer: "Le débarquement des Alliés aux Philippines",
            isCorrect: false,
          },
        ],
      },
      {
        question:
          "Quel traité a mis fin à la Seconde Guerre mondiale en Europe ?",
        answers: [
          {
            answer: "L'acte de capitulation de l'Allemagne",
            isCorrect: true,
            explanation:
              "Le 8 mai 1945, l'Allemagne a signé un acte de capitulation sans condition, marquant la fin de la guerre en Europe.",
          },
          {
            answer: "Le traité de Versailles",
            isCorrect: false,
          },
          {
            answer: "Le pacte de non-agression germano-soviétique",
            isCorrect: false,
          },
          {
            answer: "Le traité de Yalta",
            isCorrect: false,
          },
        ],
      },
    ],
  },
  resumeFiles: {
    nbFiles: 3,
    files: [
      {
        name: "Fiche 3",
        url: "/icons/filesType/resumeFiles/image 2.png",
      },
      {
        name: "Fiche 2",
        url: "/icons/filesType/resumeFiles/image-1.png",
      },
      {
        name: "Fiche 1",
        url: "/icons/filesType/resumeFiles/image.png",
      },
    ],
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
  const [isQuestionsVisible, setIsQuestionsVisible] = useState<boolean>(false);
  const [files, setFiles] = useState(course.files);
  const [resumeFiles, setResumeFiles] = useState(course.resumeFiles.files);

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
        <div className="flex items-center justify-start gap-8 ml-[2%] lg:ml-[3.5%]">
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

      {/* Default display */}
      {!isQuestionsVisible && !isResumeFilesVisible && (
        <>
          {/* Files Section */}
          <FileSection files={files} ctaUpdate={setFiles} />

          {/* Insights + Exams */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 w-full max-w-[96.5%] ml-[2%] lg:ml-[3.5%] mb-5">
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
              <div className="flex flex-col items-start gap-1 w-full">
                <p className="text-md text-white outfit-regular">
                  Examen Prévu
                </p>
                <p className="text-xs lg:text-sm text-white text-opacity-75 outfit-regular">
                  Tu as{" "}
                  <span className="text-accent text-opacity-75">
                    {course.exams.length}
                  </span>{" "}
                  examens prévus pour ce cours
                </p>
              </div>

              {/* Cards */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4 w-full">
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
            questions={course.quiz.questions}
            setIsQuizzVisible={setIsQuestionsVisible}
          />
        </div>
      )}
    </div>
  );
}
