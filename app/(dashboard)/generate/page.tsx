"use client";

import {
  GeneratorForm,
  GeneratorHeader,
  LoadingUi,
} from "@/components/generator";
import { useGeneration } from "@/hooks/use-generation";
import type { FileProcessingState } from "@/lib/types/generator";
import { useEffect, useState } from "react";

const MAX_CONCURRENT_PROCESSING = 2;

export default function Generate() {
  // File management state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileProcessingStates, setFileProcessingStates] =
    useState<FileProcessingState>({});

  // Generation logic
  const {
    isGenerationLaunched,
    generationStep,
    courseId,
    processedFiles,
    setProcessedFiles,
    handleGenerate,
    handleRecognizedText,
    handleTextRemoved,
  } = useGeneration();

  // Check if any files are being processed
  const isRecognizing = Object.values(fileProcessingStates).some(Boolean);

  // Auto-process queued files when slots become available
  useEffect(() => {
    if (
      Object.values(fileProcessingStates).length < MAX_CONCURRENT_PROCESSING
    ) {
      // Trigger re-render for queued files
      const timer = setTimeout(() => {
        // This will cause components to re-evaluate canStartProcessing
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [Object.values(fileProcessingStates).length]);

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-8 py-6 min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50">
      {isGenerationLaunched ? (
        <LoadingUi step={generationStep} idCourse={courseId} />
      ) : (
        <>
          <GeneratorHeader />
          <GeneratorForm
            onSubmit={handleGenerate}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            onRecognizedText={handleRecognizedText}
            onTextRemoved={handleTextRemoved}
            fileProcessingStates={fileProcessingStates}
            setFileProcessingStates={setFileProcessingStates}
            processedFiles={processedFiles}
            setProcessedFiles={setProcessedFiles}
            isRecognizing={isRecognizing}
          />
        </>
      )}
    </div>
  );
}
