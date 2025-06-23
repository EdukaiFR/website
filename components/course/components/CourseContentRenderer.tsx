import { resumeFilesValue } from "@/public/mocks/default-value";
import { InsightsService } from "@/services";
import { CourseResumeFiles, Quiz } from "../sections";
import { Exams } from "../sections/exams";
import { Objectives } from "../sections/objectives";
import { Overview } from "../sections/overview";
import { SimilarCourses } from "../sections/similar-courses";
import { Statistics } from "../sections/statistics";

type Exam = {
    _id: string;
    title: string;
    description: string;
    date: string;
};

interface CourseContentRendererProps {
    selectedTab: string;
    courseId: string;
    examsData: unknown;
    createExam: (
        courseId: string,
        title: string,
        description: string,
        date: Date
    ) => Promise<{ message: string } | null>;
    getExams: (courseExamsIds: string[]) => void;
    reFetchCourse: () => void;
    updateExam: (examId: string, data: unknown) => void;
    deleteExam: (examId: string) => void;
    quizId: string;
    insightsService: unknown;
    insightsData: unknown;
    quizData: unknown;
}

export function CourseContentRenderer({
    selectedTab,
    courseId,
    examsData,
    createExam,
    getExams,
    reFetchCourse,
    updateExam,
    deleteExam,
    quizId,
    insightsService,
    insightsData,
    quizData,
}: CourseContentRendererProps) {
    return (
        <div className="flex-1 min-h-0 w-full max-w-full">
            {selectedTab === "overview" && (
                <Overview
                    overview={null}
                    course_id={courseId}
                    examsData={examsData as unknown[]}
                    createExam={createExam}
                    getExams={getExams}
                    updateCourseData={reFetchCourse}
                    updateExam={updateExam}
                    deleteExam={deleteExam}
                    insights_data={
                        insightsData as {
                            averageScore: number;
                            insightsCount: number;
                            insights?: { score: number; createdAt: string }[];
                        }
                    }
                />
            )}
            {selectedTab === "resumeFiles" && (
                <CourseResumeFiles
                    course_id={courseId}
                    resumeFiles={resumeFilesValue}
                />
            )}
            {selectedTab === "exams" && (
                <Exams
                    course_id={courseId}
                    exams={examsData as Exam[]}
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
                    insights_service={
                        insightsService as unknown as InsightsService
                    }
                    insights_data={
                        insightsData as unknown as {
                            averageScore: number;
                            insightsCount: number;
                            insights?: { score: number; createdAt: string }[];
                        }
                    }
                />
            )}
            {selectedTab === "similarCourses" && (
                <SimilarCourses course_id={courseId} similarCourses={null} />
            )}
            {selectedTab === "quiz" && (
                <Quiz
                    course_id={courseId}
                    quiz_data={quizData as unknown[]}
                    quiz_id={quizId}
                    insights_service={insightsService as InsightsService}
                    insights_data={
                        insightsData as {
                            averageScore: number;
                            insightsCount: number;
                            insights?: { score: number; createdAt: string }[];
                        }
                    }
                />
            )}
        </div>
    );
}
