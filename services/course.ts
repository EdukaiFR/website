import axios from "axios";
import { getAuthToken, getCurrentUserId } from "@/lib/auth-utils";

export interface CourseService {
  createCourse: (title: string, subject: string, level: string) => Promise<any>;
  getCourseById: (courseId: string) => Promise<any>;
  addQuizToCourse: (courseId: string, quizId: string) => Promise<any>;
  createExam: (
    courseId: string,
    title: string,
    description: string,
    date: Date
  ) => Promise<{ id: string; message: string } | null>;
  getExamById: (examId: string) => Promise<any>;
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
  getCourses: () => Promise<any>;
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
        { title, subject, level }, // Include the actual user ID from session
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      console.error(
        "❌ [Course Service] Erreur lors de la création du cours",
        error
      );
      throw error;
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
        `Erreur lors de la récupération du cours ${courseId}`,
        error
      );
    }
  };

  const getCourses = async () => {
    try {
      const response = await axios.get(`${apiUrl}/courses`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des cours.`, error);
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
        `Erreur lors de l'ajout du quiz ${quizId} au cours ${courseId}`,
        error
      );
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
        `Erreur lors de la création d'un examen pour le cours ${courseId}`,
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
        `Erreur lors de la récupération de l'examen ${examId}`,
        error
      );
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
        `Erreur lors de la mise à jour de l'examen ${examId}`,
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
        `Erreur lors de la suppression de l'examen ${examId}`,
        error
      );
      return null;
    }
  };

  return {
    createCourse,
    getCourseById,
    addQuizToCourse,
    createExam,
    getExamById,
    updateExamById,
    deleteExamById,
    getCourses,
  };
}
