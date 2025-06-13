"use client";

import { TextRecognizer } from "@/components/recognition/textRecognizer";
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
import { useCourse, useQuiz } from "@/hooks";
import { useCourseService, useQuizService } from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import {
  CircleX,
  CloudUpload,
  FileText,
  WandSparkles,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoadingUi } from "./loading-ui";

type Options = "pictures" | "files";

export type GeneratorForm = {
  option: Options;
  title: string;
  subject: string;
  level: string;
  files: File[];
};

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  subject: z.string().min(1, { message: "Subject is required." }),
  level: z.string().min(1, { message: "Level is required." }),
  files: z.array(z.any()).min(1, { message: "Files are required." }), // ⚠️ Remplacement de z.instanceof(File)
});

export default function Generate() {
  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subject: "",
      level: "",
      files: [],
    },
  });

  // File Input with Drag & Drop
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const [isInputFilled, setIsInputFilled] = useState<boolean>(false);
  const [recognizedTexts, setRecognizedTexts] = useState<string[]>([]);
  const [isRecognizing, setIsRecognizing] = useState<boolean>(false);
  const [isGenerationLaunched, setGenerationLaunched] =
    useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [idGeneratedCourse, setIdGeneratedCourse] = useState<string>("");

  // Increment generation step if it's lower than 4
  const incrementGenerationStep = () => {
    if (generationStep < 4) {
      setGenerationStep((prev) =>
        prev < 4 ? ((prev + 1) as 1 | 2 | 3 | 4) : prev
      );
    }
  };

  // Quiz generation
  const quizService = useQuizService();
  const { quizId, isGenerating, generateQuiz } = useQuiz(quizService);

  // Course creation
  const courseService = useCourseService();
  const { courseId, isCreating, courseError, createCourse, addQuizToCourse } =
    useCourse(courseService);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
    form.setValue("files", [...selectedFiles, ...files]);
  };

  const handleRecognizedText = (text: string) => {
    setRecognizedTexts((prevTexts) => {
      if (!prevTexts.includes(text)) {
        return [...prevTexts, text];
      }
      return prevTexts;
    });
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    const files = Array.from(event.dataTransfer.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    form.setValue("files", [...selectedFiles, ...files]);
  };

  const onSubmit = async (data: unknown) => {
    try {
      // Format the zod form data into generator form data
      const formFields: GeneratorForm = {
        option: "files",
        title: (data as Record<string, unknown>).title as string,
        subject: (data as Record<string, unknown>).subject as string,
        level: (data as Record<string, unknown>).level as string,
        files: (data as Record<string, unknown>).files as File[],
      };
      await handleGenerate(formFields);
    } catch (error: unknown) {
      console.error("Error submitting form: ", error);
    }
  };

  // Handle Generate process
  const handleGenerate = async (formFields: GeneratorForm) => {
    if (recognizedTexts.length > 0) {
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

  // Add useEffect when a field in form is changed to check if all fields are filled
  useEffect(() => {
    const { title, subject, level, files } = form.getValues();
    if (title && subject && level && files.length > 0) {
      setIsInputFilled(true);
    } else {
      setIsInputFilled(false);
    }
  }, [form.watch()]);

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-8 py-6 min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50">
      {isGenerationLaunched ? (
        <LoadingUi step={generationStep} idCourse={courseId} />
      ) : (
        <>
          {/* Modern Header with gradient background */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <WandSparkles className="w-6 h-6 text-white" />
                </div>
                <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  Générateur IA
                </div>
              </div>
              <h1 className="text-2xl lg:text-4xl font-bold mb-2">
                Bienvenue dans le générateur
              </h1>
              <p className="text-blue-100 text-base lg:text-lg max-w-2xl">
                Remplis les champs ci-dessous puis clique sur 'Lancer la
                génération'.
              </p>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 right-8 w-20 h-20 bg-purple-300/20 rounded-full blur-lg"></div>
          </div>

          {/* Modern Form Card */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm max-w-4xl mx-auto w-full">
            <CardContent className="p-8">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
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
                    {/* Subject Field */}
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800 font-semibold">
                            Matière
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Mathématiques"
                              className="h-12 border-blue-200/60 focus:border-blue-600 focus:ring-blue-600/20 bg-white/80 backdrop-blur-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-gray-600">
                            La matière de ton cours.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Level Field */}
                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800 font-semibold">
                            Niveau
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Seconde"
                              className="h-12 border-blue-200/60 focus:border-blue-600 focus:ring-blue-600/20 bg-white/80 backdrop-blur-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-gray-600">
                            Le niveau d'étude de ton cours.
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
                      <FormItem>
                        <FormLabel className="text-gray-800 font-semibold">
                          Fichiers
                        </FormLabel>
                        <FormControl>
                          <div
                            className={clsx(
                              "relative border-dashed border-2 rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
                              isDragActive
                                ? "border-blue-600 bg-blue-50 shadow-lg scale-[1.02]"
                                : "border-blue-200/60 bg-white/50 hover:bg-blue-50/50 hover:border-blue-400 hover:shadow-md"
                            )}
                            onClick={() =>
                              document.getElementById("file-input")?.click()
                            }
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                          >
                            <input
                              id="file-input"
                              type="file"
                              multiple
                              className="hidden"
                              accept=".pdf,.txt,.png,.jpg,.jpeg,.ppt"
                              onChange={handleFileChange}
                            />
                            <div className="flex flex-col items-center justify-center">
                              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
                                <CloudUpload className="w-8 h-8 text-white" />
                              </div>
                              <p className="text-lg font-semibold text-gray-800 mb-2">
                                Drag & Drop tes fichiers ici ou clique sur le
                                cadre
                              </p>
                              <p className="text-sm text-blue-600 font-medium">
                                PDF, TXT, PNG, JPG, JPEG, PPT
                              </p>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription className="text-gray-600">
                          Sélectionnes tes fichiers
                        </FormDescription>
                        <FormMessage />

                        {/* File Preview */}
                        {selectedFiles.length > 0 && (
                          <div className="mt-6 space-y-3">
                            <h4 className="font-semibold text-gray-800 mb-3">
                              Fichiers sélectionnés :
                            </h4>
                            {selectedFiles.map((file, index) => {
                              const isProcessing = isRecognizing; // You might want to track per-file processing state

                              return (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-4 border border-blue-200/60 rounded-xl bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-200"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="relative p-2 bg-blue-100 rounded-lg">
                                      <FileText className="w-6 h-6 text-blue-600" />
                                      {isProcessing && (
                                        <div className="absolute inset-0 bg-blue-100/80 rounded-lg flex items-center justify-center">
                                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="font-medium text-gray-800">
                                        {file.name}
                                      </span>
                                      <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span>
                                          {Math.round(file.size / 1024)} KB
                                        </span>
                                        <span>•</span>
                                        {isProcessing ? (
                                          <span className="text-blue-600 font-medium">
                                            Traitement en cours...
                                          </span>
                                        ) : (
                                          <TextRecognizer
                                            key={index}
                                            selectedImage={file}
                                            onTextRecognized={
                                              handleRecognizedText
                                            }
                                            setIsRecognizing={setIsRecognizing}
                                          />
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    disabled={isProcessing}
                                    onClick={() => {
                                      const updatedFiles = selectedFiles.filter(
                                        (_, i) => i !== index
                                      );
                                      setSelectedFiles(updatedFiles);
                                      setRecognizedTexts((prevTexts) =>
                                        prevTexts.filter((_, i) => i !== index)
                                      );
                                      form.setValue("files", updatedFiles);
                                    }}
                                  >
                                    <CircleX className="w-4 h-4" />
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </FormItem>
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
        </>
      )}
    </div>
  );
}
