import axios from "axios";
import { useMemo } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export interface Subject {
    _id: string;
    title: string;
    code: string;
    level: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSubjectData {
    title: string;
    level: string;
}

export interface SubjectsService {
    getSubjects: () => Promise<Subject[] | null>;
    createSubject: (data: CreateSubjectData) => Promise<Subject | null>;
}

export function useSubjectsService(): SubjectsService {
    return useMemo(() => {
        async function getSubjects(): Promise<Subject[] | null> {
            try {
                const response = await axios.get(`${apiUrl}/subjects`, {
                    withCredentials: true,
                });

                // Check if response has items property (actual API structure)
                if (
                    response.data &&
                    typeof response.data === "object" &&
                    "items" in response.data
                ) {
                    return response.data.items as Subject[];
                }

                // Check if response.data is wrapped in another data property
                if (
                    response.data &&
                    typeof response.data === "object" &&
                    "data" in response.data
                ) {
                    return response.data.data as Subject[];
                }

                // Check if response.data is already an array
                if (Array.isArray(response.data)) {
                    return response.data;
                }

                // If response.data has subjects property
                if (
                    response.data &&
                    typeof response.data === "object" &&
                    "subjects" in response.data
                ) {
                    return response.data.subjects as Subject[];
                }

                // Unexpected response structure
                console.error(
                    "Unexpected response structure from /subjects endpoint:",
                    response.data
                );
                return null;
            } catch (error) {
                console.error("Error fetching subjects:", error);
                return null;
            }
        }

        async function createSubject(
            data: CreateSubjectData
        ): Promise<Subject | null> {
            try {
                const response = await axios.post(`${apiUrl}/subjects`, data, {
                    withCredentials: true,
                });
                return response.data;
            } catch (error) {
                console.error("Error creating subject:", error);
                return null;
            }
        }

        return {
            getSubjects,
            createSubject,
        };
    }, []);
}
