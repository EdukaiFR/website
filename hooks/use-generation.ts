"use client";

import { useCourse, useQuiz } from "@/hooks";
import type { GenerationStep, GeneratorForm } from "@/lib/types/generator";
import { useCourseService, useQuizService } from "@/services";
import { useState } from "react";

export function useGeneration() {
  const [isGenerationLaunched, setGenerationLaunched] =
    useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<GenerationStep>(0);
  const [recognizedTexts, setRecognizedTexts] = useState<string[]>([]);
  const [processedFiles, setProcessedFiles] = useState<Set<string>>(new Set());
  const [fileTextMap, setFileTextMap] = useState<Map<string, string>>(
    new Map()
  );

  // Quiz generation
  const quizService = useQuizService();
  const { quizId, isGenerating, generateQuiz } = useQuiz(quizService);

  // Course creation
  const courseService = useCourseService();
  const { courseId, isCreating, courseError, createCourse, addQuizToCourse } =
    useCourse(courseService);

  // Increment generation step if it's lower than 4
  const incrementGenerationStep = () => {
    if (generationStep < 4) {
      setGenerationStep((prev) =>
        prev < 4 ? ((prev + 1) as 1 | 2 | 3 | 4) : prev
      );
    }
  };

  const handleRecognizedText = (text: string, fileId: string) => {
    // Map file to its text for easier removal later
    setFileTextMap((prev) => new Map(prev).set(fileId, text));

    setRecognizedTexts((prevTexts) => {
      if (!prevTexts.includes(text)) {
        return [...prevTexts, text];
      }
      return prevTexts;
    });

    // Mark file as processed
    setProcessedFiles((prev) => new Set(Array.from(prev).concat(fileId)));
  };

  const handleTextRemoved = (fileId: string) => {
    const textToRemove = fileTextMap.get(fileId);
    if (textToRemove) {
      setRecognizedTexts((prevTexts) =>
        prevTexts.filter((text) => text !== textToRemove)
      );
      setFileTextMap((prev) => {
        const newMap = new Map(prev);
        newMap.delete(fileId);
        return newMap;
      });
    }
  };

  // Handle Generate process
  const handleGenerate = async (formFields: GeneratorForm) => {
    if (recognizedTexts.length > 0) {
      console.log("recognizedTexts", recognizedTexts);
      setGenerationLaunched(true);
      const generation = await generateQuiz(recognizedTexts);

      if (generation?.success) {
        const courseId = await createCourse(formFields);
        await addQuizToCourse(courseId, generation.newQuizId);

        // Each 1 second, call incrementGenerationStep until generationStep is 4
        const interval = setInterval(() => {
          incrementGenerationStep();
          if (generationStep === 4) {
            clearInterval(interval);
          }
        }, 1000);
      } else {
        // Reset generation state on failure
        setGenerationLaunched(false);
        setGenerationStep(0);
        console.error(
          "Failed to generate quiz, aborted course creation.",
          generation?.error
        );
        // TODO: display message here once we implement toasts.
        alert(
          `Erreur lors de la génération: ${
            generation?.error || "Erreur inconnue"
          }`
        );
      }
    }
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
