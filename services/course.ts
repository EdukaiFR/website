import axios from "axios";

export interface CourseService {
  createCourse: (title: string, subject: string, level: string) => Promise<any>;
  getCourseById: (courseId: string) => Promise<any>;
  addQuizToCourse: (courseId: string, quizId: string) => Promise<any>;
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
      console.error("An error ocurred creating the course", error);
    }
  };

  const getCourseById = async (courseId: string) => {
    try {
      const response = await axios.get(`${apiUrl}/courses/${courseId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error(`An error ocurred getting the course ${courseId}`, error);
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
        `An error ocurred adding the quiz ${quizId} to the course ${courseId}`,
        error
      );
    }
  };

  return { createCourse, getCourseById, addQuizToCourse };
}
