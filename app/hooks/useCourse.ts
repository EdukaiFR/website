import type { CourseService } from "@/services";
import type { GeneratorForm } from "../generator/page";
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
};

type ExamsDataArray = ExamData[];

export function useCourse(courseService: CourseService) {
    const [courseId, setCourseId] = useState('');
    const [courseData, setCourseData] = useState<CourseData | null>(null);
    const [examsData, setExamsData] = useState<ExamsDataArray | []>([]);
    const [isCreating , setIsLoading ] = useState(false);
    const [courseError, setError] = useState<string | null>(null);

    async function createCourse(formFields: GeneratorForm) {
        const { title, subject, level } = formFields;

        try {
            setIsLoading(true);
            const course = await courseService.createCourse(title, subject, level);
            const newCourseId = course.id;
            setCourseId(newCourseId);
            return newCourseId;
        } catch (error) {
            console.error("Error creating course: ", error);
            setError("Failed to create course. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const loadCourse = async (courseId: string) => {
        try {
            const response = await courseService.getCourseById(courseId);
            setCourseData(response.item);
        } catch (error) {
            console.error(`Error getting course ${courseId} `, error);
            setError("Failed to load course. Please try again.");
            return null;
        }
    }

    const addQuizToCourse = async (courseId: string, quizId: string) => {
        try {
            await courseService.addQuizToCourse(courseId, quizId);
        } catch (error) {
            console.error(`Error adding quiz ${quizId} to course ${courseId} `, error);
            setError("Failed to associate quiz to course. Please try again.");
            return null;
        }
    }

    const createExam = async (
        courseId: string,
        title: string,
        description: string,
        date: Date
    ) : Promise<{ message: string } | null> => {
        try {
            const response = await courseService.createExam(courseId, title, description, date);
            return response?.message ? { message: response.message } : null;
        } catch (error) {
            console.error("Error creating exam: ", error);
            setError(`Failed to create an exam for the course ${courseId}. Please try again.`);
            return null;
        }
    }

    const getExams = async (courseExamsIds: string[]) => {
        try {
            const response = await Promise.all(
                courseExamsIds.map(async (examId) => {
                    try {
                        const exam = await courseService.getExamById(examId);
                        return exam.item;
                    } catch (error) {
                        console.error(`Error fetching exam with id ${examId}:`, error)
                        return null;
                    }
                })
            );

            const examsData = response
                .filter((exam) => exam !== null)
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            setExamsData(examsData);

            return examsData;
        } catch (error) {
            console.error("Error getting course exams: ", error);
            setError(`Failed to get exams. Please try again.`);
            return null;
        }
    }

    const updateExamById = async (
        examId: string,
        title: string,
        description: string,
        date: Date
    ) : Promise<{ message: string } | null > => {
        try {
            const response = await courseService.updateExamById(examId, title, description, date);
            return response;
        } catch (error) {
            console.error(`Error updating exam with id ${examId}: `, error);
            setError(`Failed to update exam. Please try again.`);
            return null;
        }
    }

    const deleteExamById = async (examId: string, courseId: string) => {
        try {
            const response = await courseService.deleteExamById(examId, courseId);
            return response;
        } catch (error) {
            console.error(`Error deleting exam with id ${examId}: `, error);
            setError(`Failed to delete exam. Please try again.`);
            return null;
        }
    }

    return { courseId, isCreating, courseData, examsData, courseError,
        createCourse, loadCourse, addQuizToCourse, createExam, getExams,
        updateExamById, deleteExamById };
}