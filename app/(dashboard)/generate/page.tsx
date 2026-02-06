"use client";

import {
    GeneratorForm,
    GeneratorHeader,
    RealtimeProgress,
} from "@/components/generator";
import type {
    FileProcessingState,
    GeneratorForm as GeneratorFormType,
} from "@/lib/types/generator";
import type { ProgressEventData } from "@/lib/types/progress";
import { useCourseService } from "@/services";
import { useState } from "react";
import { toast } from "sonner";

export default function Generate() {
    // File management state
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [fileProcessingStates, setFileProcessingStates] =
        useState<FileProcessingState>({});
    const [processedFiles, setProcessedFiles] = useState<Set<string>>(
        new Set()
    );
    const [uploadedFileIds, setUploadedFileIds] = useState<{
        [localFileId: string]: string;
    }>({});

    // OCR extracted text storage
    const [recognizedTexts, setRecognizedTexts] = useState<string[]>([]);
    const [fileTextMap, setFileTextMap] = useState<Map<string, string>>(
        new Map()
    );

    // SSE tracking state
    const [jobId, setJobId] = useState<string | null>(null);
    const [courseId, setCourseId] = useState<string>("");

    const courseService = useCourseService();

    // Check if any files are being processed
    const isRecognizing = Object.values(fileProcessingStates).some(Boolean);

    /**
     * Handle course generation with SSE progress tracking
     */
    const handleGenerateWithSSE = async (
        formFields: GeneratorFormType
    ): Promise<void> => {
        // Validate that we have extracted text
        if (recognizedTexts.length === 0) {
            toast.error(
                "Veuillez attendre que l'extraction du texte soit terminée"
            );
            return;
        }

        try {
            // 1. Create the course first
            const courseResponse = await courseService.createCourse(
                formFields.title,
                formFields.subject,
                formFields.level
            );

            if (!courseResponse?.id) {
                toast.error("Impossible de créer le cours");
                return;
            }

            setCourseId(courseResponse.id);

            const fileIds = Object.values(uploadedFileIds);
            await Promise.all(
                fileIds.map(fileId =>
                    courseService.addFileToCourse(courseResponse.id, fileId)
                )
            );

            const generationResponse =
                await courseService.startCourseGeneration(courseResponse.id, {
                    extractedTexts: recognizedTexts,
                    generateQuiz: true,
                    generateSheet: true,
                    level: formFields.level,
                });

            if (generationResponse?.jobId) {
                setJobId(generationResponse.jobId);
                toast.success("Génération démarrée !");
            } else {
                toast.error("Impossible de démarrer la génération");
            }
        } catch (error: unknown) {
            console.error("Erreur lors du démarrage de la génération:", error);
            toast.error("Une erreur est survenue lors de la génération");
        }
    };

    /**
     * Callback when generation completes successfully
     */
    const handleGenerationComplete = (data: ProgressEventData | null) => {
        console.log("✅ Génération terminée avec succès!", data);
        toast.success("Votre cours est prêt !");
    };

    /**
     * Handle text recognition from uploaded files
     * IMPORTANT: Must update processedFiles to prevent OCR from re-running
     */
    const handleRecognizedText = (text: string, fileId: string) => {
        // Store the extracted text for this file
        setFileTextMap(prev => new Map(prev).set(fileId, text));

        // Add to recognized texts array (avoid duplicates)
        setRecognizedTexts(prevTexts => {
            if (!prevTexts.includes(text)) {
                return [...prevTexts, text];
            }
            return prevTexts;
        });

        // Mark file as processed to prevent OCR loop
        setProcessedFiles(prev => new Set(Array.from(prev).concat(fileId)));
    };

    /**
     * Handle text removal when file is deleted
     */
    const handleTextRemoved = (fileId: string) => {
        // Remove the text associated with this file
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

        // Remove from processed files
        setProcessedFiles(prev => {
            const updated = new Set(Array.from(prev));
            updated.delete(fileId);
            return updated;
        });
    };

    return (
        <div className="flex flex-col gap-6 px-4 lg:px-8 py-6 min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50">
            {jobId ? (
                <RealtimeProgress
                    jobId={jobId}
                    courseId={courseId}
                    onComplete={handleGenerationComplete}
                />
            ) : (
                <>
                    <GeneratorHeader />
                    <GeneratorForm
                        onSubmit={handleGenerateWithSSE}
                        selectedFiles={selectedFiles}
                        setSelectedFiles={setSelectedFiles}
                        onRecognizedText={handleRecognizedText}
                        onTextRemoved={handleTextRemoved}
                        fileProcessingStates={fileProcessingStates}
                        setFileProcessingStates={setFileProcessingStates}
                        processedFiles={processedFiles}
                        setProcessedFiles={setProcessedFiles}
                        isRecognizing={isRecognizing}
                        uploadedFileIds={uploadedFileIds}
                        setUploadedFileIds={setUploadedFileIds}
                    />
                </>
            )}
        </div>
    );
}
