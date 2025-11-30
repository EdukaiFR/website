import { ApiError, ApiErrorResponse } from "@/lib/types/api";
import { SummarySheetData } from "@/lib/types/library";
import { Visibility } from "@/lib/types/visibility";
import axios from "axios";

// Response interfaces
export interface SummarySheetsResponse {
    sheets?: SummarySheetData[];
    items?: SummarySheetData[];
    message: string;
}

export interface Quiz {
    _id: string;
    title: string;
    questions: unknown[];
    createdAt: string;
    updatedAt: string;
}

export interface QuizzesResponse {
    quizzes: Quiz[];
    message: string;
}

export interface VisibilityUpdateResponse {
    status: "success" | "failure";
    message: string;
}

export interface PublicCourseAuthor {
    firstName: string;
    lastName: string;
    username: string;
}

export interface PublicCourse {
    _id: string;
    title: string;
    subject: string;
    level: string;
    visibility?: Visibility;
    author: PublicCourseAuthor;
    createdAt: string;
}

export interface PublicCoursesResponse {
    status: "success" | "failure";
    items?: PublicCourse[];
    courses?: PublicCourse[];
    message?: string;
}

export interface CourseService {
    createCourse: (
        title: string,
        subject: string,
        level: string
    ) => Promise<{ id: string; message: string } | null>;
    getCourseById: (
        courseId: string
    ) => Promise<{ id: string; message: string } | null>;
    getCourseFiles: (
        courseId: string
    ) => Promise<{ id: string; message: string } | null>;
    getCourseSummarySheets: (courseId: string) => Promise<SummarySheetsResponse | null>;
    getCourses: () => Promise<{ id: string; message: string } | null>;
    getCourseQuizzes: (courseId: string) => Promise<QuizzesResponse | null>;
    addQuizToCourse: (
        courseId: string,
        quizId: string
    ) => Promise<{ id: string; message: string } | null>;
    addSheetToCourse: (
        courseId: string,
        sheetId: string
    ) => Promise<{ id: string; message: string } | null>;
    addFileToCourse: (
        courseId: string,
        fileId: string
    ) => Promise<{ id: string; message: string } | null>;
    createExam: (
        courseId: string,
        title: string,
        description: string,
        date: Date
    ) => Promise<{ id: string; message: string } | null>;
    getExamById: (
        examId: string
    ) => Promise<{ id: string; message: string } | null>;
    deleteExamById: (
        examId: string,
        courseId: string
    ) => Promise<{ message: string } | null>;
    updateExamById: (
        examId: string,
        title: string,
        description: string,
        date: Date
    ) => Promise<{ message: string } | null>;
    getAllExams: () => Promise<{
        items: Array<{
            _id: string;
            title: string;
            date: string;
            courseId: string | null;
            courseTitle: string | null;
            courseSubject: string | null;
        }>;
        message: string;
        status: string;
    } | null>;
    updateVisibility: (
        courseId: string,
        visibility: Visibility
    ) => Promise<VisibilityUpdateResponse | ApiErrorResponse>;
    getPublicCourses: () => Promise<PublicCoursesResponse | ApiErrorResponse>;
}

export function useCourseService() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const createCourse = async (
        title: string,
        subject: string,
        level: string
    ) => {
        try {
            const response = await axios.post(
                `${apiUrl}/courses`,
                { title, subject, level },
                { withCredentials: true }
            );

            return response.data;
        } catch (error) {
            console.error("An error occurred creating the course.", error);
            return null;
        }
    };

    const getCourseById = async (courseId: string) => {
        try {
            const response = await axios.get(`${apiUrl}/courses/${courseId}`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error(
                `An error occurred fetching course ${courseId}`,
                error
            );
            return null;
        }
    };

    const getCourses = async () => {
        try {
            const response = await axios.get(`${apiUrl}/courses`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error(`An error occurred fetching courses.`, error);
            return null;
        }
    };

    const getCourseFiles = async (courseId: string) => {
        try {
            const response = await axios.get(
                `${apiUrl}/courses/${courseId}/files`,
                {
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.error(
                `An error occurred fetching course ${courseId} files`,
                error
            );
            return null;
        }
    };

    const addQuizToCourse = async (courseId: string, quizId: string) => {
        try {
            const response = await axios.post(
                `${apiUrl}/courses/${courseId}/addQuiz`,
                { quizId: quizId },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error(
                `An error occurred associating ${quizId} to
        course ${courseId}`,
                error
            );
            return null;
        }
    };

    const addSheetToCourse = async (courseId: string, sheetId: string) => {
        try {
            const response = await axios.post(
                `${apiUrl}/courses/${courseId}/addSheet`,
                { sheetId: sheetId },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error(
                `An error occurred associating summary sheet ${sheetId} to
        course ${courseId}`,
                error
            );
            return null;
        }
    };

    const addFileToCourse = async (courseId: string, fileId: string) => {
        try {
            const response = await axios.post(
                `${apiUrl}/courses/${courseId}/addFile`,
                { fileId: fileId },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error(
                `[CourseService] ❌ Error adding file ${fileId} to course ${courseId}:`,
                error
            );
            if (axios.isAxiosError(error)) {
                console.error("[CourseService] Axios error details:", {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                });
            }
            return null;
        }
    };

    const getCourseSummarySheets = async (courseId: string) => {
        try {
            const response = await axios.get(
                `${apiUrl}/courses/${courseId}/summary-sheets`,
                {
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.error(
                `[CourseService] ❌ Error fetching course ${courseId} summary sheets:`,
                error
            );
            if (axios.isAxiosError(error)) {
                console.error("[CourseService] Axios error details:", {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                });
            }
            return null;
        }
    };

    const updateExamById = async (
        examId: string,
        title: string,
        description: string,
        date: Date
    ): Promise<{ message: string } | null> => {
        try {
            const response = await axios.put(
                `${apiUrl}/exams/${examId}`,
                { title, description, date },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error(
                `An error occurred updating the exam ${examId}`,
                error
            );
            return null;
        }
    };

    const deleteExamById = async (
        examId: string,
        courseId: string
    ): Promise<{ message: string } | null> => {
        try {
            const response = await axios.delete(
                `${apiUrl}/exams/${examId}/${courseId}`,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error(
                `An error occurred deleting the exam ${examId}`,
                error
            );
            return null;
        }
    };

    // Course's Exams \\
    const createExam = async (
        courseId: string,
        title: string,
        description: string,
        date: Date
    ): Promise<{ id: string; message: string } | null> => {
        try {
            const response = await axios.post(
                `${apiUrl}/courses/${courseId}/exams`,
                { title, description, date },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error(
                `An error occurred creating exam for course ${courseId}`,
                error
            );
            return null;
        }
    };

    const getExamById = async (examId: string) => {
        try {
            const response = await axios.get(`${apiUrl}/exams/${examId}`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error(
                `An error occurred fetching the exam ${examId}`,
                error
            );
            return null;
        }
    };

    const updateVisibility = async (
        courseId: string,
        visibility: Visibility
    ) => {
        try {
            const response = await axios.patch(
                `${apiUrl}/courses/${courseId}/visibility`,
                { visibility: visibility },
                { withCredentials: true }
            );

            return response.data;
        } catch (error: unknown) {
            const err = error as ApiError;
            if (err?.response?.data) {
                return err.response.data as ApiErrorResponse;
            }

            return {
                status: "failure",
                message: "Une erreur est survenue lors du partage du cours.",
            };
        }
    };

    const getPublicCourses = async (): Promise<PublicCoursesResponse | ApiErrorResponse> => {
        try {
            const response = await axios.get(`${apiUrl}/courses/public`);

            return response.data;
        } catch (error: unknown) {
            const err = error as ApiError;
            if (err?.response?.data) {
                return err.response.data as ApiErrorResponse;
            }

            return {
                status: "failure",
                message:
                    "Une erreur est survenue lors de la récupération des cours publics.",
            };
        }
    };

    const getAllExams = async () => {
        try {
            const response = await axios.get(`${apiUrl}/exams`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error("An error occurred fetching all exams.", error);
            return null;
        }
    };

    const getCourseQuizzes = async (courseId: string) => {
        try {
            const response = await axios.get(
                `${apiUrl}/courses/${courseId}/quizzes`,
                {
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.error(
                `[CourseService] ❌ Error fetching course ${courseId} quizzes:`,
                error
            );
            if (axios.isAxiosError(error)) {
                console.error("[CourseService] Axios error details:", {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                });
            }
            return null;
        }
    };

    return {
        createCourse,
        getCourseById,
        getCourseFiles,
        getCourseSummarySheets,
        getCourses,
        getCourseQuizzes,
        addQuizToCourse,
        addSheetToCourse,
        addFileToCourse,
        createExam,
        getExamById,
        updateExamById,
        deleteExamById,
        getAllExams,
        updateVisibility,
        getPublicCourses,
    };
}
