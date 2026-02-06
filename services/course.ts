/**
 * Course Service
 *
 * Provides methods for course CRUD operations, exam management,
 * and course generation with SSE progress tracking.
 *
 * ## Error Handling Conventions
 *
 * This service uses two patterns for error handling:
 *
 * ### Pattern 1: Return null on error (Legacy)
 * - Used by: createCourse, getCourseById, getCourses, etc.
 * - Returns `null` on error, caller must handle null case
 * - Logs error in development mode only
 *
 * ### Pattern 2: Return ApiResult (Recommended for new methods)
 * - Used by: updateVisibility, getPublicCourses
 * - Returns `{ status: "success" | "failure", message, data? }`
 * - Caller can use type guards: `if (result.status === "success")`
 *
 * When adding new methods, prefer Pattern 2 for better type safety.
 * See `lib/types/api.ts` for `ApiResult<T>` type and helpers.
 *
 * @module services/course
 */

import { ApiError, ApiErrorResponse } from "@/lib/types/api";
import { SummarySheetData } from "@/lib/types/library";
import type { StartGenerationResponse } from "@/lib/types/progress";
import { Visibility } from "@/lib/types/visibility";
import axios from "axios";

// ============================================================================
// Response Interfaces
// ============================================================================

/**
 * Response containing summary sheets for a course
 * @deprecated Use ApiResult<SummarySheetData[]> for new implementations
 */
export interface SummarySheetsResponse {
    sheets?: SummarySheetData[];
    items?: SummarySheetData[];
    message: string;
}

/** Quiz entity */
export interface Quiz {
    _id: string;
    title: string;
    questions: unknown[];
    createdAt: string;
    updatedAt: string;
}

/**
 * Response containing quizzes for a course
 * @deprecated Use ApiResult<Quiz[]> for new implementations
 */
export interface QuizzesResponse {
    quizzes: Quiz[];
    message: string;
}

/** Response for visibility update operations */
export interface VisibilityUpdateResponse {
    status: "success" | "failure";
    message: string;
}

/** Author information for public courses */
export interface PublicCourseAuthor {
    firstName: string;
    lastName: string;
    username: string;
}

/** Public course entity */
export interface PublicCourse {
    _id: string;
    title: string;
    subject: string;
    level: string;
    visibility?: Visibility;
    author: PublicCourseAuthor;
    createdAt: string;
}

/** Response containing public courses */
export interface PublicCoursesResponse {
    status: "success" | "failure";
    items?: PublicCourse[];
    courses?: PublicCourse[];
    message?: string;
}

/** Options for course generation */
export interface GenerateCourseOptions {
    /** Extracted text content from OCR processing */
    extractedTexts: string[];
    /** Whether to generate a quiz (default: true) */
    generateQuiz?: boolean;
    /** Whether to generate a summary sheet (default: true) */
    generateSheet?: boolean;
    /** Education level for content adaptation */
    level?: string;
}

// ============================================================================
// Logging Helpers
// ============================================================================

/**
 * Log error in development mode only
 * Prevents sensitive information from leaking in production
 */
function logServiceError(context: string, error: unknown): void {
    if (process.env.NODE_ENV === "development") {
        console.error(`[CourseService] ${context}:`, error);
        if (axios.isAxiosError(error)) {
            console.error("[CourseService] Details:", {
                status: error.response?.status,
                statusText: error.response?.statusText,
            });
        }
    }
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
    getCourseSummarySheets: (
        courseId: string
    ) => Promise<SummarySheetsResponse | null>;
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
    deleteCourse: (
        courseId: string
    ) => Promise<{ status: string; message: string } | ApiErrorResponse>;
    updateVisibility: (
        courseId: string,
        visibility: Visibility
    ) => Promise<VisibilityUpdateResponse | ApiErrorResponse>;
    getPublicCourses: () => Promise<PublicCoursesResponse | ApiErrorResponse>;
    startCourseGeneration: (
        courseId: string,
        options: GenerateCourseOptions
    ) => Promise<StartGenerationResponse | null>;
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
            logServiceError("Error creating course", error);
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
            logServiceError(`Error fetching course ${courseId}`, error);
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
            logServiceError("Error fetching courses", error);
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
            logServiceError(`Error fetching course ${courseId} files`, error);
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
            logServiceError(
                `Error associating quiz ${quizId} to course ${courseId}`,
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
            logServiceError(
                `Error associating sheet ${sheetId} to course ${courseId}`,
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
            logServiceError(
                `Error adding file ${fileId} to course ${courseId}`,
                error
            );
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
            logServiceError(
                `Error fetching course ${courseId} summary sheets`,
                error
            );
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
            logServiceError(`Error updating exam ${examId}`, error);
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
            logServiceError(`Error deleting exam ${examId}`, error);
            return null;
        }
    };

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
            logServiceError(
                `Error creating exam for course ${courseId}`,
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
            logServiceError(`Error fetching exam ${examId}`, error);
            return null;
        }
    };

    const deleteCourse = async (
        courseId: string
    ): Promise<{ status: string; message: string } | ApiErrorResponse> => {
        try {
            const response = await axios.delete(
                `${apiUrl}/courses/${courseId}`,
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
                message:
                    "Une erreur est survenue lors de la suppression du cours.",
            };
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

    const getPublicCourses = async (): Promise<
        PublicCoursesResponse | ApiErrorResponse
    > => {
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
            logServiceError("Error fetching all exams", error);
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
            logServiceError(`Error fetching course ${courseId} quizzes`, error);
            return null;
        }
    };

    /**
     * Start course generation with SSE progress tracking
     *
     * @param courseId - The course ID to generate content for
     * @param options - Generation options including extracted texts and settings
     * @returns Promise with jobId for SSE tracking, or null on error
     */
    const startCourseGeneration = async (
        courseId: string,
        options: GenerateCourseOptions
    ): Promise<StartGenerationResponse | null> => {
        try {
            // Combine all extracted texts into a single textString
            const textString = options.extractedTexts.join("\n\n---\n\n");

            const response = await axios.post(
                `${apiUrl}/courses/${courseId}/generate`,
                {
                    textString,
                    generateQuiz: options.generateQuiz ?? true,
                    generateSheet: options.generateSheet ?? true,
                    level: options.level,
                },
                {
                    withCredentials: true,
                }
            );

            return response.data as StartGenerationResponse;
        } catch (error) {
            logServiceError(
                `Error starting generation for course ${courseId}`,
                error
            );
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
        deleteCourse,
        getAllExams,
        updateVisibility,
        getPublicCourses,
        startCourseGeneration,
    };
}
