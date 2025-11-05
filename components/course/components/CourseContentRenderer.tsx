import { InsightsService } from "@/services";
import { CourseSummarySheets, Quiz } from "../sections";
import { Exams } from "../sections/exams";
import MyFiles from "../sections/Files/MyFiles";
import { Objectives } from "../sections/objectives";
import { Overview } from "../sections/overview";
import { SimilarCourses } from "../sections/similar-courses";
import { Statistics } from "../sections/statistics";
import { SummarySheetData } from "@/lib/types/library";

type Exam = {
    _id: string;
    title: string;
    description: string;
    date: string;
};

interface CourseContentRendererProps {
    selectedTab: string;
    courseId: string;
    courseTitle?: string;
    examsData: unknown;
    summarySheetsData: SummarySheetData[];
    storageUserId: string;
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
    loadCourseFiles: (courseId: string) => Promise<unknown>;
    refreshSummarySheets?: () => void;
}

export function CourseContentRenderer({
    selectedTab,
    courseId,
    courseTitle,
    examsData,
    createExam,
    getExams,
    reFetchCourse,
    updateExam,
    deleteExam,
    quizId,
    insightsService,
    insightsData,
    summarySheetsData,
    storageUserId,
    quizData,
    loadCourseFiles,
    refreshSummarySheets,
}: CourseContentRendererProps) {
    return (
        <div className="flex-1 min-h-0 w-full max-w-full">
            {selectedTab === "overview" && (
                <Overview
                    overview={null}
                    course_id={courseId}
                    course_title={courseTitle}
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
                    summarySheetsData={summarySheetsData}
                />
            )}
            {selectedTab === "summarySheets" && (
                <CourseSummarySheets
                    user_id={storageUserId}
                    course_id={courseId}
                    summarySheets={summarySheetsData}
                    onRefresh={refreshSummarySheets}
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
            {selectedTab === "myFiles" && (
                <MyFiles courseId={courseId} getCourseFiles={loadCourseFiles} />
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
