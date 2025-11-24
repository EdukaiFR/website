import { useCourse, useQuiz } from "@/hooks";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { SummarySheetData } from "@/lib/types/library";
import {
    useCourseService,
    useInsightsService,
    useQuizService,
} from "@/services";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useCourseLogic() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseId = params?.id?.toString() || "";

    const { storageUserId } = useSessionStorage();

    // Get tab from URL or default to "overview"
    const tabFromUrl = searchParams.get("tab") || "overview";

    // State
    const [quizId, setQuizId] = useState<string>("");
    const [isQuestionsVisible, setQuestionsVisible] = useState<boolean>(false);
    const [isSummarySheetsVisible, setSummarySheetsVisible] =
        useState<boolean>(false);
    const [selectedTabState, setSelectedTabState] =
        useState<string>(tabFromUrl);

    // Ref to track if insights have been loaded for a quizId
    const insightsLoadedRef = useRef<string | null>(null);
    // Ref to track if initial insights fetch is in progress
    const insightsFetchingRef = useRef<boolean>(false);
    // AbortController ref for canceling requests
    const abortControllerRef = useRef<AbortController | null>(null);

    // Wrapper to update both state and URL
    const setSelectedTab = (tab: string) => {
        setSelectedTabState(tab);
        // Update URL without reloading the page
        const newUrl = `/library/${courseId}?tab=${tab}`;
        router.push(newUrl, { scroll: false });
    };

    // Sync state with URL on mount and URL changes
    useEffect(() => {
        if (tabFromUrl) {
            setSelectedTabState(tabFromUrl);
        }
    }, [tabFromUrl]);

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

    const { quizData, insightsData, loadQuiz, getQuizInsights, createInsight } =
        useQuiz(quizService, insightsService);

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
            await loadQuiz(quizId);
            // Load insights immediately only if we're on a tab that needs them
            if (
                selectedTabState === "statistics" ||
                selectedTabState === "overview"
            ) {
                if (
                    !insightsFetchingRef.current &&
                    insightsLoadedRef.current !== quizId
                ) {
                    // Cancel previous request
                    abortControllerRef.current?.abort();
                    abortControllerRef.current = new AbortController();

                    insightsFetchingRef.current = true;
                    try {
                        await getQuizInsights(quizId);
                        insightsLoadedRef.current = quizId;
                    } catch (error) {
                        if (
                            error instanceof Error &&
                            error.name !== "AbortError"
                        ) {
                            // Only log non-abort errors
                        }
                    } finally {
                        insightsFetchingRef.current = false;
                    }
                }
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
            // Reset insights loaded ref when course changes
            insightsLoadedRef.current = null;
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

            // Backend now returns both AI-generated and user-uploaded sheets
            // with proper structure including type and source fields
            const sheets = data?.items || [];

            setSummarySheetsData(sheets);
        }
    };

    // Ensure insights are loaded when switching to statistics or overview tab
    useEffect(() => {
        const loadInsightsForTab = async () => {
            if (
                (selectedTabState === "statistics" ||
                    selectedTabState === "overview") &&
                quizId &&
                !insightsFetchingRef.current &&
                insightsLoadedRef.current !== quizId
            ) {
                // Cancel previous request
                abortControllerRef.current?.abort();
                abortControllerRef.current = new AbortController();

                // Prevent duplicate calls
                insightsFetchingRef.current = true;
                try {
                    await getQuizInsights(quizId);
                    // Mark as loaded after successful fetch
                    insightsLoadedRef.current = quizId;
                } catch (error) {
                    if (error instanceof Error && error.name !== "AbortError") {
                        // Only handle non-abort errors
                    }
                } finally {
                    insightsFetchingRef.current = false;
                }
            }
        };

        loadInsightsForTab();

        // Cleanup on unmount
        return () => {
            abortControllerRef.current?.abort();
        };
    }, [selectedTabState, quizId, getQuizInsights]);

    return {
        courseId,
        selectedTab: selectedTabState,
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
        loadSummarySheets,
        getQuizInsights,
    };
}
