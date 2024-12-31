import type { CourseService } from "@/services";
import type { GeneratorForm } from "../generator/page";
import { useState } from "react";

interface CourseData {
    title: string;
    subject: string;
    level: string;
    resumeFiles: [];
}

export function useCourse(courseService: CourseService) {
    const [courseId, setCourseId] = useState('');
    const [courseData, setCourseData] = useState<CourseData | null>(null);
    const [isCreating , setIsLoading ] = useState(false);
    const [courseError, setError] = useState<string | null>(null);

    async function createCourse(formFields: GeneratorForm) {
        const { title, subject, level } = formFields;

        try {
            setIsLoading(true);
            const course = await courseService.createCourse(title, subject, level);
            setCourseId(course.id);
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
            setError("Failed to create course. Please try again.");
            return null;
        }
    }

    return { courseId, isCreating, courseData, courseError, createCourse, loadCourse };
}