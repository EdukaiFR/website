"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    GeneratorFormSchema,
    type GeneratorFormSchemaType,
} from "@/lib/schemas/generator.schema";
import type { FileProcessingState, GeneratorForm } from "@/lib/types/generator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FileUpload } from "./file-upload";
import { SubjectCombobox } from "./subject-combobox";
import { LevelCombobox } from "./level-combobox";
import { NewSubjectDialog } from "./new-subject-dialog";
import { useSubjects } from "@/hooks/useSubjects";
import { useSubjectsService } from "@/services/subjects";

type GeneratorFormProps = {
    onSubmit: (
        data: GeneratorForm,
        uploadedFileIds: { [localFileId: string]: string }
    ) => Promise<void>;
    selectedFiles: File[];
    setSelectedFiles: (files: File[] | ((prev: File[]) => File[])) => void;
    onRecognizedText: (text: string, fileId: string) => void;
    onTextRemoved: (fileId: string) => void;
    fileProcessingStates: FileProcessingState;
    setFileProcessingStates: (
        states:
            | FileProcessingState
            | ((prev: FileProcessingState) => FileProcessingState)
    ) => void;
    processedFiles: Set<string>;
    setProcessedFiles: (
        files: Set<string> | ((prev: Set<string>) => Set<string>)
    ) => void;
    isRecognizing: boolean;
    uploadedFileIds: { [localFileId: string]: string };
    setUploadedFileIds: React.Dispatch<
        React.SetStateAction<{ [localFileId: string]: string }>
    >;
};

export function GeneratorForm({
    onSubmit,
    selectedFiles,
    setSelectedFiles,
    onRecognizedText,
    onTextRemoved,
    fileProcessingStates,
    setFileProcessingStates,
    processedFiles,
    setProcessedFiles,
    isRecognizing,
    uploadedFileIds,
    setUploadedFileIds,
}: GeneratorFormProps) {
    const [showNewSubjectDialog, setShowNewSubjectDialog] = useState(false);

    // Initialize subjects service and hook (the service itself is stateless and doesn't change)
    const subjectsService = useSubjectsService();
    const {
        subjects,
        groupedSubjects,
        isLoading: isLoadingSubjects,
        createSubject,
        getLevelLabel,
    } = useSubjects(subjectsService);

    const form = useForm<GeneratorFormSchemaType>({
        resolver: zodResolver(GeneratorFormSchema),
        defaultValues: {
            title: "",
            subject: "",
            level: "",
            files: [],
        },
    });

    const isInputFilled =
        form.watch("title") &&
        form.watch("subject") &&
        form.watch("level") &&
        selectedFiles.length > 0;

    const handleFormSubmit = async (data: GeneratorFormSchemaType) => {
        try {
            const formFields: GeneratorForm = {
                option: "files",
                title: data.title,
                subject: data.subject,
                level: data.level,
                files: data.files,
            };
            await onSubmit(formFields, uploadedFileIds);
        } catch (error: unknown) {
            console.error("Error submitting form: ", error);
        }
    };

    const handleFilesChange = (files: File[]) => {
        form.setValue("files", files);
    };

    // Watch form values for validation
    useEffect(() => {
        const subscription = form.watch(() => {
            // Trigger validation when form values change
        });
        console.log("Uploaded file id's: ", uploadedFileIds);
        return () => subscription.unsubscribe();
    }, [form, uploadedFileIds]);

    return (
        <>
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm max-w-4xl mx-auto w-full">
                <CardContent className="p-8">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleFormSubmit)}
                            className="flex flex-col gap-6"
                        >
                            {/* Title Field */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-800 font-semibold">
                                            Titre
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Les équations du second degré"
                                                className="h-12 border-blue-200/60 focus:border-blue-600 focus:ring-blue-600/20 bg-white/80 backdrop-blur-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-gray-600">
                                            Renseigne le titre de ton cours.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Level Field - Now comes first */}
                                <FormField
                                    control={form.control}
                                    name="level"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800 font-semibold">
                                                Niveau d&apos;étude
                                            </FormLabel>
                                            <FormControl>
                                                <LevelCombobox
                                                    subjects={subjects}
                                                    value={field.value}
                                                    onChange={newLevel => {
                                                        field.onChange(
                                                            newLevel
                                                        );
                                                        // Reset subject when level changes
                                                        form.setValue(
                                                            "subject",
                                                            ""
                                                        );
                                                    }}
                                                    onAddNew={() =>
                                                        setShowNewSubjectDialog(
                                                            true
                                                        )
                                                    }
                                                    isLoading={
                                                        isLoadingSubjects
                                                    }
                                                    placeholder="Sélectionner un niveau..."
                                                    getLevelLabel={
                                                        getLevelLabel
                                                    }
                                                />
                                            </FormControl>
                                            <FormDescription className="text-gray-600">
                                                Le niveau d&apos;étude de ton
                                                cours.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Subject Field - Now comes second and is filtered by level */}
                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800 font-semibold">
                                                Matière
                                            </FormLabel>
                                            <FormControl>
                                                <SubjectCombobox
                                                    subjects={subjects}
                                                    groupedSubjects={
                                                        groupedSubjects
                                                    }
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    onAddNew={() =>
                                                        setShowNewSubjectDialog(
                                                            true
                                                        )
                                                    }
                                                    isLoading={
                                                        isLoadingSubjects
                                                    }
                                                    placeholder="Sélectionner une matière..."
                                                    getLevelLabel={
                                                        getLevelLabel
                                                    }
                                                    selectedLevel={form.watch(
                                                        "level"
                                                    )}
                                                    disabled={
                                                        !form.watch("level")
                                                    }
                                                />
                                            </FormControl>
                                            <FormDescription className="text-gray-600">
                                                La matière de ton cours.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* File Upload Field */}
                            <FormField
                                control={form.control}
                                name="files"
                                render={() => (
                                    <FileUpload
                                        selectedFiles={selectedFiles}
                                        setSelectedFiles={setSelectedFiles}
                                        onFilesChange={handleFilesChange}
                                        onRecognizedText={onRecognizedText}
                                        onTextRemoved={onTextRemoved}
                                        fileProcessingStates={
                                            fileProcessingStates
                                        }
                                        setFileProcessingStates={
                                            setFileProcessingStates
                                        }
                                        processedFiles={processedFiles}
                                        setProcessedFiles={setProcessedFiles}
                                        uploadedFileIds={uploadedFileIds}
                                        setUploadedFileIds={setUploadedFileIds}
                                    />
                                )}
                            />

                            <Button
                                disabled={!isInputFilled || isRecognizing}
                                type="submit"
                                className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                            >
                                <Sparkles className="w-5 h-5 mr-2" />
                                Lancer la génération
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* New Subject Dialog */}
            <NewSubjectDialog
                open={showNewSubjectDialog}
                onOpenChange={setShowNewSubjectDialog}
                onSubmit={async data => {
                    const newSubject = await createSubject(data);
                    if (newSubject) {
                        // Set the newly created subject as the selected value using its code
                        form.setValue("subject", newSubject.code);
                        // If the level was not selected, set it from the new subject
                        if (!form.watch("level")) {
                            form.setValue("level", newSubject.level);
                        }
                        setShowNewSubjectDialog(false);
                    }
                }}
                defaultLevel={form.watch("level")}
            />
        </>
    );
}
