import { useCourseService } from "@/services";
import { useEffect, useState } from "react";

interface ExamData {
    _id: string;
    title: string;
    date: string;
    courseId: string | null;
    courseTitle: string | null;
    courseSubject: string | null;
}

export function useAllExams() {
    const courseService = useCourseService();
    const [allExams, setAllExams] = useState<ExamData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllExams = async () => {
            try {
                setLoading(true);

                // Get all exams directly from the new API endpoint
                const examsResponse = await courseService.getAllExams();

                if (!examsResponse || examsResponse.status !== "success") {
                    setAllExams([]);
                    setLoading(false);
                    return;
                }

                const exams = examsResponse.items as ExamData[];

                // Sort by date (closest first) and filter future exams only
                const now = new Date();
                const upcomingExams = exams
                    .filter((exam: ExamData) => new Date(exam.date) >= now)
                    .sort((a: ExamData, b: ExamData) => new Date(a.date).getTime() - new Date(b.date).getTime());

                setAllExams(upcomingExams);
            } catch (error) {
                console.error("Error fetching all exams:", error);
                setAllExams([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAllExams();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { allExams, loading };
}
