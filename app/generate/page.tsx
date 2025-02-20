"use client";

import { TextRecognizer } from "@/components/recognition/textRecognizer";
import { Button } from "@/components/ui/button";
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
import { CircleX, CloudUpload, FileText, WandSparkles } from "lucide-react";
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

  const onSubmit = async (data: any) => {
    try {
      // Format the zod form data into generator form data
      const formFields: GeneratorForm = {
        option: "files",
        title: data.title,
        subject: data.subject,
        level: data.level,
        files: data.files,
      };
      await handleGenerate(formFields);
    } catch (error: any) {
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
        // TODO: display message here once we implement toasts.
        console.error("Failed to generate quiz, aborted course creation.");
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
    <div className="flex flex-col gap-6 px-6 min-h-[calc(100vh-5rem)] w-full">
      {isGenerationLaunched ? (
        <LoadingUi step={generationStep} idCourse={courseId} />
      ) : (
        <>
          {/* Titre principal */}
          <div className="flex flex-col gap-1 items-center justify-center">
            <h1 className="text-4xl font-bold text-[#3C517C]">
              Bienvenue dans le générateur
            </h1>
            <p className="text-md text-medium-muted">
              Remplis les champs ci-dessous puis clique sur 'Lancer la
              génération'.
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full lg:w-1/2 mx-auto flex flex-col gap-4"
            >
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Les équations du second degré"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Renseigne le titre de ton cours.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full flex flex-col lg:flex-row gap-4">
                {/* Subject Field */}
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Matière</FormLabel>
                      <FormControl>
                        <Input placeholder="Mathématiques" {...field} />
                      </FormControl>
                      <FormDescription>
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
                    <FormItem className="flex-1">
                      <FormLabel>Niveau</FormLabel>
                      <FormControl>
                        <Input placeholder="Seconde" {...field} />
                      </FormControl>
                      <FormDescription>
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
                    <FormLabel>Fichiers</FormLabel>
                    <FormControl>
                      <div
                        className={clsx(
                          "border-dashed border-2 rounded-lg p-6 text-center cursor-pointer bg-[#6C757D] bg-opacity-5",
                          isDragActive
                            ? "border-[#2d6bcf] bg-[#6C757D] bg-opacity-25"
                            : "border-gray-300 hover:bg-[#6C757D] hover:bg-opacity-15"
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
                          <CloudUpload
                            size={48}
                            strokeWidth={1.5}
                            className="text-[#3678FF]"
                          />
                          <p className="mt-2 text-sm text-[#6C757D] text-opacity-50">
                            PDF, TXT, PNG, JPG, JPEG, PPT
                          </p>
                          <p className="text-sm text-black font-semibold">
                            Drag & Drop tes fichiers ici ou clique sur le cadre
                          </p>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>Sélectionnes tes fichiers</FormDescription>
                    <FormMessage />

                    {/* File Preview */}
                    <div className="mt-4 space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-start p-2 border rounded-md bg-white"
                        >
                          <FileText
                            size={32}
                            strokeWidth={1.5}
                            className="text-medium mr-4"
                          />
                          <div className="flex flex-col items-start gap-0">
                            <span className="text-sm">{file.name}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500">
                                {Math.round(file.size / 1024)} KB |{" "}
                              </span>
                              <TextRecognizer
                                key={index}
                                selectedImage={file}
                                onTextRecognized={handleRecognizedText}
                                setIsRecognizing={setIsRecognizing}
                              />
                            </div>
                          </div>

                          <Button
                            variant={"ghost"}
                            size={"icon"}
                            className="transition-all p-2 text-destructive/75 hover:text-destructive ml-auto"
                            onClick={() => {
                              const updatedFiles = selectedFiles.filter(
                                (_, i) => i !== index
                              );
                              setSelectedFiles(updatedFiles);
                              setRecognizedTexts((prevTexts) =>
                                prevTexts.filter((_, i) => i !== index)
                              );
                              form.setValue("files", updatedFiles); // Met à jour Zod form
                            }}
                          >
                            <CircleX size={16} strokeWidth={1.5} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </FormItem>
                )}
              />

              <Button
                disabled={!isInputFilled || isRecognizing}
                type="submit"
                className="bg-gradient-to-tr from-[#2D6BCF] to-[#3678FF] text-white py-2 px-4 rounded-md hover:opacity-95 mb-4"
              >
                <WandSparkles size={16} className="mr-2" />
                Lancer la génération
              </Button>
            </form>
          </Form>
        </>
      )}
    </div>
  );
}
