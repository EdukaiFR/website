"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Plus, Upload, FileText, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { fileToast } from "@/lib/toast";
import { z } from "zod";
import { useState } from "react";

const fileSchema = z.custom<File>((value) => {
  return value instanceof File;
}, "Expected a File object");

const formSchema = z.object({
  files: z.array(fileSchema).min(1, { message: "Files are required." }),
});

export type AddSummarySheetProps = object;

export const AddSummarySheet = (props: AddSummarySheetProps) => {
  type FormData = z.infer<typeof formSchema>;
  const [isDragActive, setIsDragActive] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  });

  const watchedFiles = form.watch("files");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    form.setValue("files", [...watchedFiles, ...files]);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    const files = Array.from(event.dataTransfer.files);
    form.setValue("files", [...watchedFiles, ...files]);
  };

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = watchedFiles.filter(
      (_, index) => index !== indexToRemove
    );
    form.setValue("files", updatedFiles);
  };

  const onSubmit = async (data: FormData) => {
    try {
      // TODO: call hooks to add summarySheet(s)
      console.log("Files to upload:", data.files);
      fileToast.uploadSuccess();
    } catch (error: unknown) {
      console.error(
        "Erreur lors de la soumission du formulaire de fichiers:",
        error
      );
      fileToast.uploadError();
    } finally {
      form.reset();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 px-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter des fichiers
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] lg:max-w-[520px] p-0 border-0 bg-transparent shadow-none">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <DialogHeader className="text-center mb-8">
            <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl w-fit">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Ajouter des fiches de révision
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2 text-sm leading-relaxed">
              Téléchargez vos documents de révision (PDF, images, etc.) pour les
              organiser et y accéder facilement
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {/* Custom Drag & Drop Area */}
                <div
                  className={`p-6 border-2 border-dashed rounded-2xl transition-colors duration-200 cursor-pointer ${
                    isDragActive
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-200 bg-gray-50/50 hover:bg-gray-50"
                  }`}
                  onClick={() => document.getElementById("file-input")?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragActive(true);
                  }}
                  onDragLeave={() => setIsDragActive(false)}
                  onDrop={handleDrop}
                >
                  <div className="text-center space-y-3">
                    <div className="p-3 bg-blue-50 rounded-xl w-fit mx-auto">
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">
                        Glissez vos fichiers ici
                      </h4>
                      <p className="text-sm text-gray-600">
                        ou cliquez pour parcourir vos fichiers
                      </p>
                    </div>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.svg,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="text-xs text-gray-500 text-center space-y-1">
                  <p>Formats acceptés: PDF, JPG, PNG, DOC, DOCX</p>
                  <p>Taille maximale: 10MB par fichier</p>
                </div>
              </div>

              {watchedFiles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 text-sm">
                    Fichiers sélectionnés ({watchedFiles.length})
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {watchedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100"
                      >
                        <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-4">
                <DialogClose asChild>
                  <Button
                    disabled={!watchedFiles.length}
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Ajouter{" "}
                    {watchedFiles.length > 0
                      ? `${watchedFiles.length} fichier${
                          watchedFiles.length > 1 ? "s" : ""
                        }`
                      : "les fichiers"}
                  </Button>
                </DialogClose>
              </div>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};
