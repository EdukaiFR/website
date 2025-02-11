import axios from "axios";
import 'dotenv/config';

export interface CourseService {
    createCourse: (title: string, subject: string, level: string) => Promise<any>;
    getCourseById: (courseId: string) => Promise<any>;
    addQuizToCourse: (courseId: string, quizId: string) => Promise<any>;
    createExam: (courseId: string, title: string, description: string, date: Date) => Promise<{ id: string, message: string } | null>;
    getExamById: (examId: string) => Promise<any>;
    deleteExamById: (examId: string, courseId: string ) => Promise<{ message: string } | null>;
    updateExamById: (examId: string, title: string, description: string, date: Date) => Promise<{ message: string } | null>;
}

export function useCourseService() {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Course \\
    const createCourse = async (title: string, subject: string, level: string) => {
        try {
            const response = await axios.post(`${apiUrl}/courses/create`,
                { title, subject, level },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error('An error ocurred creating the course', error);
        }
    }

    const getCourseById = async (courseId: string) => {
        try {
            const response = await axios.get(`${apiUrl}/courses/${courseId}`,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error(`An error ocurred getting the course ${courseId}`, error);
        }
    }

    // Course's Quizs \\
    const addQuizToCourse = async (courseId: string, quizId: string) => {
        try {
            const response = await axios.post(`${apiUrl}/courses/${courseId}/addQuiz`,
                { quizId: quizId },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error(`An error ocurred adding the quiz ${quizId} to the course ${courseId}`, error);
        }
    }

    // Course's Exams \\
    const createExam = async (
        courseId: string,
        title: string,
        description: string,
        date: Date
    ): Promise<{ id: string, message: string } | null> => {
        try {
            const response = await axios.post(`${apiUrl}/courses/${courseId}/exams`,
                { title, description, date },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error(`An error ocurred creating an exam for the course ${courseId}`, error);
            return null;
        }
    }

    const getExamById = async ( examId: string ) => {
        try {
            const response = await axios.get(`${apiUrl}/exams/${examId}`,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error(`An error ocurred getting exam ${examId}`, error);
        }
    }

    const updateExamById = async (
        examId: string,
        title: string,
        description: string,
        date: Date
    ) : Promise<{ message: string } | null > => {
        try {
            const response = await axios.put(`${apiUrl}/exams/${examId}`,
                { title, description, date },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error(`An error ocurred updating exam ${examId}`, error);
            return null;
        }
    }

    const deleteExamById = async ( examId: string, courseId: string ) :
        Promise<{ message: string } | null > =>
    {
        try {
            const response = await axios.delete(`${apiUrl}/exams/${examId}/${courseId}`,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error(`An error ocurred deleting exam ${examId}`, error);
            return null;
        }
    }

    return { createCourse, getCourseById, addQuizToCourse, createExam,
        getExamById, updateExamById, deleteExamById };
}




