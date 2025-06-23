import { useCourse, useQuiz } from "@/hooks";
import {
    useCourseService,
    useInsightsService,
    useQuizService,
} from "@/services";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useCourseLogic() {
    const params = useParams();
    const courseId = params?.id?.toString() || "";

    // State
    const [quizId, setQuizId] = useState<string>("");
    const [isQuestionsVisible, setQuestionsVisible] = useState<boolean>(false);
    const [isResumeFilesVisible, setResumeFilesVisible] =
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
                    console.log(
                        `🔍 [Page] Loading insights for ${selectedTab} tab, quizId:`,
                        quizId,
                        "Current insights:",
                        insightsData
                    );
                    await getQuizInsights(quizId);
                }
            }
        };

        loadInsightsForTab();
    }, [selectedTab, quizId, getQuizInsights]); // Removed insightsData from dependencies to avoid loop

    // Debug logging for insights data
    useEffect(() => {
        console.log("🔍 [Page] Debug - Insights data updated:", {
            quizId,
            insightsData,
            selectedTab,
            hasInsightsService: !!insightsService,
        });
    }, [insightsData, quizId, selectedTab]);

    return {
        courseId,
        selectedTab,
        setSelectedTab,
        courseData,
        quizData,
        examsData,
        insightsData,
        quizId,
        insightsService,
        createExam,
        getExams,
        reFetchCourse,
        updateExam,
        deleteExam,
        loadCourseFiles,
    };
}
