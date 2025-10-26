import axios from "axios";

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
    getCourseSummarySheets: (courseId: string) => Promise<any>;
    getCourses: () => Promise<{ id: string; message: string } | null>;
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
    toggleShare: (courseId: string) => Promise<any>;
    getSharedCourse: (shareToken: string) => Promise<any>;
    duplicateSharedCourse: (shareToken: string) => Promise<any>;
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
                `${apiUrl}/courses/create`,
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
                `An error occurred adding file ${fileId} to
        course ${courseId}`,
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
            console.error(
                `An error occurred fetching course ${courseId} summary sheets`,
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

    const toggleShare = async (courseId: string) => {
        try {
            const response = await axios.post(
                `${apiUrl}/courses/${courseId}/share`,
                {},
                { withCredentials: true }
            );

            return response.data;
        } catch (error: any) {
            if (error?.response?.data) {
                return error.response.data;
            }

            return {
                status: "failure",
                message: "Une erreur est survenue lors du partage du cours.",
            };
        }
    };

    const getSharedCourse = async (shareToken: string) => {
        try {
            const response = await axios.get(
                `${apiUrl}/courses/shared/${shareToken}`
            );

            return response.data;
        } catch (error: any) {
            if (error?.response?.data) {
                return error.response.data;
            }

            return {
                status: "failure",
                message: "Le cours partagé n'a pas été trouvé ou le lien a été révoqué.",
            };
        }
    };

    const duplicateSharedCourse = async (shareToken: string) => {
        try {
            const response = await axios.post(
                `${apiUrl}/courses/shared/${shareToken}/duplicate`,
                {},
                { withCredentials: true }
            );

            return response.data;
        } catch (error: any) {
            if (error?.response?.data) {
                return error.response.data;
            }

            return {
                status: "failure",
                message: "Une erreur est survenue lors de l'ajout du cours à votre bibliothèque.",
            };
        }
    };

    return {
        createCourse,
        getCourseById,
        getCourseFiles,
        getCourseSummarySheets,
        getCourses,
        addQuizToCourse,
        addSheetToCourse,
        addFileToCourse,
        createExam,
        getExamById,
        updateExamById,
        deleteExamById,
        toggleShare,
        getSharedCourse,
        duplicateSharedCourse,
    };
}
