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
import { Header } from "./Header";
import { NavBar as NavBarComp } from "./NavBar";
import { SimilarCourses } from "./sections/similar-courses/SimilarCourses";

export default function MyCourses() {
  // Get the course ID from the URL
  const params = useParams();
  const courseId = params?.id?.toString() || "";
  console.log(courseId);

  // State
  const [quizId, setQuizId] = useState<string>("");
  const [isQuestionsVisible, setQuestionsVisible] = useState<boolean>(false);
  const [isResumeFilesVisible, setResumeFilesVisible] =
    useState<boolean>(false);
  const [exams, setExams] = useState<any[]>([]);

  // Fetch data
  const courseService = useCourseService();
  const { courseData, loadCourse } = useCourse(courseService);
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

  if (!courseData || !quizData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6 px-6 min-h-[calc(100vh-5rem)] w-full">
      <Header courseData={courseData} quizData={quizData} />
      <NavBarComp
        setSelectedTab={setSelectedTab}
        tabs={navBar}
        selectedTab={selectedTab}
      />

      {/* Display the good section depands on selectedTab */}
      {selectedTab === "overview" && (
        <Overview overview={null} course_id={course.id.toString()} />
      )}
      {selectedTab === "resumeFiles" && (
        <ResumeFiles
          course_id={course.id.toString()}
          resumeFiles={resumeFilesValue}
        />
      )}
      {selectedTab === "exams" && (
        <Exams course_id={course.id.toString()} exams={null} />
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
    </div>
  );
}
