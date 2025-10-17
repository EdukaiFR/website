import { useState, useEffect, useCallback } from "react";
import {
    Subject,
    SubjectsService,
    CreateSubjectData,
} from "@/services/subjects";
import { toast } from "sonner";

export function useSubjects(subjectsService: SubjectsService) {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch all subjects
    const loadSubjects = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await subjectsService.getSubjects();

            // Add defensive check for array
            if (data && Array.isArray(data)) {
                // Sort subjects alphabetically by title
                const sortedSubjects = data.sort((a, b) =>
                    a.title.localeCompare(b.title)
                );
                setSubjects(sortedSubjects);
            } else if (data === null) {
                // Null is a valid response when there's an error
                setError("Failed to load subjects");
                setSubjects([]);
            } else {
                // Unexpected data type - should not happen with proper typing
                setError("Invalid data format received");
                setSubjects([]);
            }
        } catch (err) {
            console.error("Error loading subjects:", err);
            setError("Failed to load subjects");
            setSubjects([]);
        } finally {
            setIsLoading(false);
        }
    }, [subjectsService]);

    // Create a new subject
    const createSubject = useCallback(
        async (data: CreateSubjectData): Promise<Subject | null> => {
            setError(null);

            try {
                const newSubject = await subjectsService.createSubject(data);
                if (newSubject) {
                    // Add the new subject to the list and sort
                    setSubjects(prev => {
                        const updated = [...prev, newSubject];
                        return updated.sort((a, b) =>
                            a.title.localeCompare(b.title)
                        );
                    });
                    toast.success("Nouvelle matière ajoutée avec succès");
                    return newSubject;
                } else {
                    toast.error("Erreur lors de la création de la matière");
                    return null;
                }
            } catch (err) {
                console.error("Error creating subject:", err);
                toast.error("Erreur lors de la création de la matière");
                return null;
            }
        },
        [subjectsService]
    );

    // Load subjects on mount
    useEffect(() => {
        loadSubjects();
    }, [loadSubjects]);

    // Get level label - handles both numeric codes and text levels
    const getLevelLabel = (levelCode: string): string => {
        // Map for numeric codes
        const numericMap: Record<string, string> = {
            "100": "Primaire",
            "200": "Collège",
            "300": "Lycée",
            "400": "Terminale",
            "500": "Post-Bac",
            "999": "Autre",
        };

        // Map for text levels (from backend)
        const textMap: Record<string, string> = {
            primaire: "Primaire",
            collège: "Collège",
            lycée: "Lycée",
            terminale: "Terminale",
            postbac: "Post-Bac",
            autre: "Autre",
        };

        // Try numeric map first, then text map (lowercase), fallback to unknown
        return (
            numericMap[levelCode] ||
            textMap[levelCode.toLowerCase()] ||
            "Niveau inconnu"
        );
    };

    // Group subjects by level
    const groupedSubjects = subjects.reduce(
        (acc, subject) => {
            const levelLabel = getLevelLabel(subject.level);
            if (!acc[levelLabel]) {
                acc[levelLabel] = [];
            }
            acc[levelLabel].push(subject);
            return acc;
        },
        {} as Record<string, Subject[]>
    );

    return {
        subjects,
        groupedSubjects,
        isLoading,
        error,
        loadSubjects,
        createSubject,
        getLevelLabel,
    };
}
