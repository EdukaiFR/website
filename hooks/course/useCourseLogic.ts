import { useCourse, useQuiz } from "@/hooks";
import {
    useCourseService,
    useInsightsService,
    useQuizService,
} from "@/services";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SummarySheetData } from "@/lib/types/library";
import { useSessionStorage } from "@/hooks/useSessionStorage";

export function useCourseLogic() {
    const params = useParams();
    const courseId = params?.id?.toString() || "";

    const { storageUserId } = useSessionStorage();

    // State
    const [quizId, setQuizId] = useState<string>("");
    const [isQuestionsVisible, setQuestionsVisible] = useState<boolean>(false);
    const [isSummarySheetsVisible, setSummarySheetsVisible] =
        useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState("overview");

    // Services
    const courseService = useCourseService();
    const quizService = useQuizService();
    const insightsService = useInsightsService();

    // Hooks
    const {
        courseData,
        loadCourse,
        loadCourseFiles,
        loadCourseSummarySheets,
        examsData,
        createExam,
        getExams,
        updateExamById,
        deleteExamById,
    } = useCourse(courseService);

    const { quizData, insightsData, loadQuiz, getQuizInsights } = useQuiz(
        quizService,
        insightsService
    );

    const [summarySheetsData, setSummarySheetsData] = useState<
        SummarySheetData[] | []
    >([]);

    // Refetch course data
    const reFetchCourse = async () => {
        if (courseId) {
            await loadCourse(courseId);
        }
    };

    // For now we handle only the first quiz of the course
    const fetchQuiz = async () => {
        if (courseData && courseData.quizzes.length > 0) {
            const quizId = courseData.quizzes[0];
            setQuizId(quizId);
            const quizResponse = await loadQuiz(quizId);
            // Always try to load insights for the quiz
            await getQuizInsights(quizId);
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
                description:
                    "Une erreur s'est produite lors de la suppression.",
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
                    description:
                        "L'examen " +
                        updatedExam.title +
                        " a bien été modifié.",
                });
                await reFetchCourse();
            } else {
                toast.error("Oups..", {
                    description:
                        "Une erreur s'est produite lors de la modification.",
                });
                console.error("Error updating exam");
            }
        } catch (error: unknown) {
            console.error("Error updating exam: ", error);
            toast.error("Oups..", {
                description:
                    "Une erreur s'est produite lors de la modification.",
            });
        }
    };

    // Effects
    useEffect(() => {
        if (courseId) {
            loadCourse(courseId);
            loadCourseFiles(courseId);
            loadSummarySheets();
        }
    }, [courseId]);

    useEffect(() => {
        fetchQuiz();
    }, [courseData, isQuestionsVisible]);

    useEffect(() => {
        if (isQuestionsVisible && isSummarySheetsVisible) {
            setSummarySheetsVisible(false);
        }
    }, [isQuestionsVisible]);

    useEffect(() => {
        if (isQuestionsVisible && isSummarySheetsVisible) {
            setQuestionsVisible(false);
        }
    }, [isSummarySheetsVisible]);

    const loadSummarySheets = async () => {
        if (courseId && loadCourseSummarySheets) {
            const data = await loadCourseSummarySheets(courseId);
            setSummarySheetsData(data.items);
        }
    };

    // Ensure insights are loaded when switching to statistics or overview tab
    useEffect(() => {
        const loadInsightsForTab = async () => {
            if (
                (selectedTab === "statistics" || selectedTab === "overview") &&
                quizId
            ) {
                // Only load if we truly don't have any insights data yet
                const hasValidInsights =
                    insightsData &&
                    (insightsData.insightsCount > 0 ||
                        insightsData.averageScore > 0);

                if (!hasValidInsights) {
                    await getQuizInsights(quizId);
                }
            }
        };

        loadInsightsForTab();
    }, [selectedTab, quizId, getQuizInsights]); // Removed insightsData from dependencies to avoid loop

    return {
        courseId,
        selectedTab,
        setSelectedTab,
        courseData,
        quizData,
        examsData,
        summarySheetsData,
        insightsData,
        quizId,
        insightsService,
        storageUserId,
        createExam,
        getExams,
        reFetchCourse,
        updateExam,
        deleteExam,
        loadCourseFiles,
    };
}
