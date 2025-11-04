"use client";

import { useCourse, useQuiz, useSheet } from "@/hooks";
import type { GenerationStep, GeneratorForm } from "@/lib/types/generator";
import {
    useCourseService,
    useQuizService,
    useSummarySheetService,
} from "@/services";
import { useRef, useState } from "react";

export function useGeneration() {
    const [isGenerationLaunched, setGenerationLaunched] =
        useState<boolean>(false);
    const [generationStep, setGenerationStep] = useState<GenerationStep>(0);
    const generationStepRef = useRef<GenerationStep>(0);
    const [recognizedTexts, setRecognizedTexts] = useState<string[]>([]);
    const [processedFiles, setProcessedFiles] = useState<Set<string>>(
        new Set()
    );
    const [fileTextMap, setFileTextMap] = useState<Map<string, string>>(
        new Map()
    );

    // Quiz generation
    const quizService = useQuizService();
    const { quizId, isGenerating, generateQuiz } = useQuiz(quizService);

    // Summary sheet generation
    const summarySheetsService = useSummarySheetService();
    const { sheetId, generateSheet } = useSheet(summarySheetsService);

    // Course creation
    const courseService = useCourseService();
    const {
        courseId,
        isCreating,
        courseError,
        createCourse,
        addQuizToCourse,
        addSheetToCourse,
        addFileToCourse,
    } = useCourse(courseService);

    // Increment generation step if it's lower than 4
    const incrementGenerationStep = () => {
        if (generationStepRef.current < 4) {
            const newStep = (generationStepRef.current + 1) as 1 | 2 | 3 | 4;
            generationStepRef.current = newStep;
            setGenerationStep(newStep);
        }
    };

    const handleRecognizedText = (text: string, fileId: string) => {
        // Map file to its text for easier removal later
        setFileTextMap(prev => new Map(prev).set(fileId, text));

        setRecognizedTexts(prevTexts => {
            if (!prevTexts.includes(text)) {
                return [...prevTexts, text];
            }
            return prevTexts;
        });

        // Mark file as processed
        setProcessedFiles(prev => new Set(Array.from(prev).concat(fileId)));
    };

    const handleTextRemoved = (fileId: string) => {
        const textToRemove = fileTextMap.get(fileId);
        if (textToRemove) {
            setRecognizedTexts(prevTexts =>
                prevTexts.filter(text => text !== textToRemove)
            );
            setFileTextMap(prev => {
                const newMap = new Map(prev);
                newMap.delete(fileId);
                return newMap;
            });
        }
    };

    // Handle Generate process
    const handleGenerate = async (
        formFields: GeneratorForm,
        uploadedFileIds: { [localFileId: string]: string }
    ) => {
        if (recognizedTexts.length === 0) return;

        setGenerationLaunched(true);

        // Reset generation step
        generationStepRef.current = 0;
        setGenerationStep(0);

        const [quizGeneration, sheetGeneration] = await Promise.all([
            generateQuiz(recognizedTexts),
            generateSheet(recognizedTexts),
        ]);

        if (!quizGeneration?.success && !sheetGeneration?.success) {
            // TODO: display message in a toast.
            return;
        }

        const courseId = await createCourse(formFields);

        if (courseId) {
            for (const fileId of Object.values(uploadedFileIds)) {
                await addFileToCourse(courseId, fileId);
            }

            if (quizGeneration?.success) {
                await addQuizToCourse(courseId, quizGeneration.newQuizId);
            }

            if (sheetGeneration?.success) {
                await addSheetToCourse(courseId, sheetGeneration.newSheetId);
            }
        } else {
            return;
        }

        // Increment steps progressively over 4 seconds
        let currentStep = 0;
        const interval = setInterval(() => {
            currentStep++;
            if (currentStep <= 4) {
                const newStep = currentStep as 1 | 2 | 3 | 4;
                generationStepRef.current = newStep;
                setGenerationStep(newStep);
            }

            if (currentStep >= 4) {
                clearInterval(interval);
            }
        }, 1000);
    };

    return {
        isGenerationLaunched,
        generationStep,
        recognizedTexts,
        processedFiles,
        courseId,
        isGenerating,
        isCreating,
        courseError,
        handleGenerate,
        handleRecognizedText,
        handleTextRemoved,
        setGenerationLaunched,
        setGenerationStep,
        setProcessedFiles,
    };
}
