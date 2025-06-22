"use client";

// Mocks value // TODO: delete when it's link to DB
import { resumeFilesValue } from "@/public/mocks/default-value";

// Import components
import { Exams } from "./sections/exams/Exams";
import { Objectives } from "./sections/objectives/Objectives";
import { Overview } from "./sections/overview/Overview";
import { ResumeFiles } from "./sections/resume-files/ResumeFiles";
import { Statistics } from "./sections/statistics/Statistics";

// Receive the parameters from the URL
import { useParams } from "next/navigation";
// Import hooks & services
import { useCourse, useQuiz } from "@/hooks";
import {
  useCourseService,
  useInsightsService,
  useQuizService,
} from "@/services";
// Temporary test data for the course
import course from "@/json/testData/course.json";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Header } from "./Header";
import { NavBar as NavBarComp } from "./NavBar";
import { Quiz } from "./sections/quiz/Quiz";
import { SimilarCourses } from "./sections/similar-courses/SimilarCourses";

export default function MyCourses() {
  // Get the course ID from the URL
  const params = useParams();
  const courseId = params?.id?.toString() || "";

  // State
  const [quizId, setQuizId] = useState<string>("");
  const [isQuestionsVisible, setQuestionsVisible] = useState<boolean>(false);
  const [isResumeFilesVisible, setResumeFilesVisible] =
    useState<boolean>(false);
  // Fetch data
  const courseService = useCourseService();
  const {
    courseData,
    loadCourse,
    loadCourseFiles,
    examsData,
    createExam,
    getExams,
    updateExamById,
    deleteExamById,
  } = useCourse(courseService);
  const quizService = useQuizService();
  const insightsService = useInsightsService();
  const { quizData, insightsData, loadQuiz, getQuizInsights } = useQuiz(
    quizService,
    insightsService
  );

  const navBar = [
    { label: "Aperçu", tab: "overview", component: Overview },
    { label: "Fiches de révision", tab: "resumeFiles", component: ResumeFiles },
    { label: "Examens", tab: "exams", component: Exams },
    { label: "Objectifs", tab: "objectives", component: Objectives },
    { label: "Statistiques", tab: "statistics", component: Statistics },
    {
      label: "Cours similaires",
      tab: "similarCourses",
      component: SimilarCourses,
    },
  ];

  const [selectedTab, setSelectedTab] = useState(navBar[0].tab);

  const reFetchCourse = async () => {
    if (courseId) {
      await loadCourse(courseId);
    }
  };

  useEffect(() => {
    if (courseId) {
      loadCourse(courseId);
      loadCourseFiles(courseId)
    }
  }, [courseId]);

  useEffect(() => {
    fetchQuiz();
  }, [courseData, isQuestionsVisible]);

  useEffect(() => {
    if (isQuestionsVisible && isResumeFilesVisible) {
      setResumeFilesVisible(false);
    }
  }, [isQuestionsVisible]);

  useEffect(() => {
    if (isQuestionsVisible && isResumeFilesVisible) {
      setQuestionsVisible(false);
    }
  }, [isResumeFilesVisible]);

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

  // Ensure insights are loaded when switching to statistics tab
  useEffect(() => {
    const loadInsightsForStats = async () => {
      if (selectedTab === "statistics" && quizId && !insightsData) {
        console.log(
          "🔍 [Page] Loading insights for statistics tab, quizId:",
          quizId
        );
        await getQuizInsights(quizId);
      }
    };

    loadInsightsForStats();
  }, [selectedTab, quizId, insightsData, getQuizInsights]);

  // Debug logging for insights data
  useEffect(() => {
    console.log("🔍 [Page] Debug - Insights data updated:", {
      quizId,
      insightsData,
      selectedTab,
      hasInsightsService: !!insightsService,
    });
  }, [insightsData, quizId, selectedTab]);

  // Delete Exam
  const deleteExam = async (examId: string) => {
    try {
      const deletionResponse = await deleteExamById(examId, courseId);
      if (deletionResponse) {
        await reFetchCourse();
        toast.success("Examen supprimé", {
          description: "L'examen a bien été supprimé.",
        });
      }
    } catch (error: unknown) {
      console.error("Error deleting exam: ", error);
      toast.error("Oups..", {
        description: "Une erreur s'est produite lors de la suppression.",
      });
    }
  };

  // Update Exam
  const updateExam = async (examId: string, data: unknown) => {
    try {
      const examData = data as Record<string, unknown>;
      const updatedExam = {
        _id: examId,
        title: examData.title as string,
        description: examData.description as string,
        date: new Date(examData.date as string),
      };

      const updateResponse = await updateExamById(
        examId,
        updatedExam.title,
        updatedExam.description,
        updatedExam.date
      );

      if (updateResponse) {
        toast.success("Examen modifié", {
          description: "L'examen " + updatedExam.title + " a bien été modifié.",
        });
        await reFetchCourse();
      } else {
        toast.error("Oups..", {
          description: "Une erreur s'est produite lors de la modification.",
        });
        console.error("Error updating exam");
      }
    } catch (error: unknown) {
      console.error("Error updating exam: ", error);
      toast.error("Oups..", {
        description: "Une erreur s'est produite lors de la modification.",
      });
    }
  };

  // Modern Loading UI
  if (!courseData || !quizData) {
    return (
      <div className="flex flex-col gap-4 sm:gap-6 px-3 sm:px-4 lg:px-8 py-3 sm:py-6 min-h-[calc(100vh-3.5rem)] w-full bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50">
        <div className="flex items-center justify-center w-full h-full min-h-[50vh] sm:min-h-[60vh]">
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
            <p className="text-muted-foreground text-sm sm:text-base">
              Chargement du cours...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 px-3 sm:px-4 lg:px-6 xl:px-8 py-2 sm:py-3 lg:py-4 min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50 w-full max-w-full">
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        * {
          box-sizing: border-box;
          max-width: 100%;
        }
        html,
        body {
          max-width: 100vw;
        }
        /* Prevent any navigation elements from overflowing */
        nav,
        .nav,
        [role="navigation"] {
          max-width: 100%;
          overflow-x: hidden;
        }
        /* Ensure buttons and interactive elements don't overflow */
        button,
        .btn {
          max-width: 100%;
          word-break: break-word;
        }
      `}</style>

      <Header
        courseData={courseData}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      {selectedTab !== "quiz" && (
        <NavBarComp
          setSelectedTab={setSelectedTab}
          tabs={navBar}
          selectedTab={selectedTab}
        />
      )}

      {/* Content with responsive layout */}
      <div className="flex-1 min-h-0 w-full max-w-full">
        {/* Display the good section depends on selectedTab */}
        {selectedTab === "overview" && (
          <Overview
            overview={null}
            course_id={courseId}
            examsData={examsData}
            createExam={createExam}
            getExams={getExams}
            updateCourseData={reFetchCourse}
            updateExam={updateExam}
            deleteExam={deleteExam}
          />
        )}
        {selectedTab === "resumeFiles" && (
          <ResumeFiles course_id={courseId} resumeFiles={resumeFilesValue} />
        )}
        {selectedTab === "exams" && (
          <Exams
            course_id={courseId}
            exams={examsData}
            createExam={createExam}
            getExams={getExams}
            updateCourseData={reFetchCourse}
            updateExam={updateExam}
            deleteExam={deleteExam}
          />
        )}
        {selectedTab === "objectives" && (
          <Objectives course_id={courseId} objectives={null} />
        )}
        {selectedTab === "statistics" && (
          <Statistics
            course_id={courseId}
            statistics={null}
            quiz_id={quizId}
            insights_service={insightsService}
            insights_data={insightsData}
          />
        )}
        {selectedTab === "similarCourses" && (
          <SimilarCourses course_id={courseId} similarCourses={null} />
        )}
        {selectedTab === "quiz" && (
          <Quiz
            course_id={courseId}
            quiz_data={quizData}
            quiz_id={quizId}
            insights_service={insightsService}
            insights_data={insightsData}
          />
        )}
      </div>
    </div>
  );
}
