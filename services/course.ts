import axios from "axios";
import 'dotenv/config';

export interface CourseService {
    createCourse: (title: string, subject: string, level: string) => Promise<any>;
    getCourseById: (courseId: string) => Promise<any>;
}

export function useCourseService() {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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

    return { createCourse, getCourseById };
}




