import type { GeneratorForm } from "@/lib/types/generator";
import type { CourseService } from "@/services";
import { courseToast, examToast, handleError } from "@/lib/toast";
import { useState } from "react";

interface CourseData {
  title: string;
  subject: string;
  level: string;
  quizzes: string[];
  exams: string[];
  resumeFiles: [];
}

interface ExamData {
  id: string;
  title: string;
  description: string;
  date: Date;
}

type ExamsDataArray = ExamData[];

export function useCourse(courseService: CourseService) {
  const [courseId, setCourseId] = useState("");
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [coursesData, setCoursesData] = useState<CourseData[]>([]);
  const [examsData, setExamsData] = useState<ExamsDataArray | []>([]);
  const [isCreating, setIsLoading] = useState(false);
  const [courseError, setError] = useState<string | null>(null);

  async function createCourse(formFields: GeneratorForm) {
    const { title, subject, level } = formFields;

    try {
      setIsLoading(true);
      const course = await courseService.createCourse(title, subject, level);
      const newCourseId = course.id;
      setCourseId(newCourseId);
      courseToast.createSuccess();
      return newCourseId;
    } catch (error) {
      console.error("Erreur lors de la création du cours:", error);
      courseToast.createError();
      setError("Échec de la création du cours. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }

  const loadCourse = async (courseId: string) => {
    try {
      const response = await courseService.getCourseById(courseId);
      setCourseData(response.item);
      // Also call getExams to get the exams associated with the course
      await getExams(response.item.exams);
    } catch (error) {
      console.error(`Erreur lors du chargement du cours ${courseId}:`, error);
      courseToast.loadError();
      setError("Échec du chargement du cours. Veuillez réessayer.");
      return null;
    }
  };

  const loadAllCourses = async () => {
    try {
      const response = await courseService.getCourses();
      setCoursesData(response.items);
      return response.items;
    } catch (error) {
      console.error("Error getting all courses: ", error);
      setError("Failed to load courses. Please try again.");
      return null;
    }
  };

  const addQuizToCourse = async (courseId: string, quizId: string) => {
    try {
      await courseService.addQuizToCourse(courseId, quizId);
    } catch (error) {
      console.error(
        `Error adding quiz ${quizId} to course ${courseId} `,
        error
      );
      setError("Failed to associate quiz to course. Please try again.");
      return null;
    }
  };

  const createExam = async (
    courseId: string,
    title: string,
    description: string,
    date: Date
  ): Promise<{ message: string } | null> => {
    try {
      const response = await courseService.createExam(
        courseId,
        title,
        description,
        date
      );
      examToast.createSuccess();
      return response?.message ? { message: response.message } : null;
    } catch (error) {
      console.error("Erreur lors de la création de l'examen:", error);
      examToast.createError();
      setError(
        `Échec de la création d'un examen pour le cours ${courseId}. Veuillez réessayer.`
      );
      return null;
    }
  };

  const getExams = async (courseExamsIds: string[]) => {
    try {
      const response = await Promise.all(
        courseExamsIds.map(async (examId) => {
          const exam = await courseService.getExamById(examId);
          return exam.item;
        })
      );

      const examsData = response.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

      setExamsData(examsData);

      return examsData;
    } catch (error) {
      console.error("Error getting course exams: ", error);
      setError(`Failed to get exams. Please try again.`);
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
      const response = await courseService.updateExamById(
        examId,
        title,
        description,
        date
      );
      return response;
    } catch (error) {
      console.error(`Error updating exam with id ${examId}: `, error);
      setError(`Failed to update exam. Please try again.`);
      return null;
    }
  };

  const deleteExamById = async (examId: string, courseId: string) => {
    try {
      const response = await courseService.deleteExamById(examId, courseId);
      return response;
    } catch (error) {
      console.error(`Error deleting exam with id ${examId}: `, error);
      setError(`Failed to delete exam. Please try again.`);
      return null;
    }
  };

  return {
    courseId,
    isCreating,
    courseData,
    coursesData,
    courseError,
    examsData,
    createCourse,
    loadCourse,
    loadAllCourses,
    addQuizToCourse,
    createExam,
    getExams,
    updateExamById,
    deleteExamById,
  };
}
