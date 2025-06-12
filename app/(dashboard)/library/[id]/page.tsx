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
      <div className="flex flex-col gap-6 px-4 lg:px-8 py-6 min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50">
        <div className="flex items-center justify-center w-full h-full min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-muted-foreground">Chargement du cours...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6 py-4 h-[calc(100vh-8rem)] bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50">
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

      {/* Content without scroll - compact layout */}
      <div className="flex-1 min-h-0">
        {/* Display the good section depends on selectedTab */}
        {selectedTab === "overview" && (
          <Overview 
            overview={null} 
            course_id={course.id.toString()}
            examsData={examsData}
            createExam={createExam}
            getExams={getExams}
            updateCourseData={reFetchCourse}
            updateExam={updateExam}
            deleteExam={deleteExam}
          />
        )}
        {selectedTab === "resumeFiles" && (
          <ResumeFiles
            course_id={course.id.toString()}
            resumeFiles={resumeFilesValue}
          />
        )}
        {selectedTab === "exams" && (
          <Exams
            course_id={courseId.toString()}
            exams={examsData}
            createExam={createExam}
            getExams={getExams}
            updateCourseData={reFetchCourse}
            updateExam={updateExam}
            deleteExam={deleteExam}
          />
        )}
        {selectedTab === "objectives" && (
          <Objectives course_id={course.id.toString()} objectives={null} />
        )}
        {selectedTab === "statistics" && (
          <Statistics course_id={course.id.toString()} statistics={null} />
        )}
        {selectedTab === "similarCourses" && (
          <SimilarCourses
            course_id={course.id.toString()}
            similarCourses={null}
          />
        )}
        {selectedTab === "quiz" && (
          <Quiz course_id={course.id.toString()} quiz_data={quizData} />
        )}
      </div>
    </div>
  );
}
