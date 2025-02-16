"use client";

//TODO: create a comp for the Drag & Drop section to avoid a lot of lines

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Check, CircleX, CloudUpload, FileText, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  files: z.array(z.instanceof(File)).min(1, { message: "Files are required." }),
});

export type AddResumeFileProps = {};

export const AddResumeFile = (props: AddResumeFileProps) => {
  type FormData = z.infer<typeof formSchema>;
  // File Input with Drag & Drop
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isInputFilled, setIsInputFilled] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
    form.setValue("files", [...selectedFiles, ...files]);
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
      console.log("Form submitted with data:", data);
      // TODO: call hooks to add resumeFile(s)
    } catch (error: any) {
      console.error("Error submitting resumeFile(s) form: ", error);
    }
  };

  // Add useEffect when a field in form is changed to check if all fields are filled
  useEffect(() => {
    const { files } = form.getValues();
    if (files.length > 0) {
      setIsInputFilled(true);
    } else {
      setIsInputFilled(false);
    }
  }, [form.watch()]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="text-[#2D6BCF] text-sm hover:bg-[#2D6BCF]/10 hover:text-[#2D6BCF] rounded-full px-3 py-1 flex items-center gap-1"
          onClick={() => {}}
        >
          <Plus size={16} />
          Ajouter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter une fiche de révision</DialogTitle>
          <DialogDescription>
            Remplis le formulaire ci-dessous par ajouter tes propres fiches de
            révision.
          </DialogDescription>
        </DialogHeader>

        {/* Content (form) */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full mx-auto flex flex-col gap-4"
          >
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
                  <ScrollArea
                    className="h-[200px] w-full rounded-md p-4 border"
                    hidden={selectedFiles.length === 0}
                  >
                    <div className="flex flex-col items-start gap-1 w-full">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-start p-2 border rounded-md bg-white w-full"
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
                                {Math.round(file.size / 1024)} KB
                              </span>
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
                              form.setValue("files", updatedFiles); // Met à jour Zod form
                            }}
                          >
                            <CircleX size={16} strokeWidth={1.5} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </FormItem>
              )}
            />

            <Button
              disabled={!isInputFilled}
              type="submit"
              className="bg-gradient-to-tr from-[#2D6BCF] to-[#3678FF] text-white py-2 px-4 rounded-md hover:opacity-95 mt-auto"
            >
              <Check size={16} className="mr-2" />
              Lancer la génération
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
