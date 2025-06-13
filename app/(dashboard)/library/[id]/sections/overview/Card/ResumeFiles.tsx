"use client";

import { CounterBadge } from "@/components/badge/CounterBadge";
import { ResumeFileCard } from "@/components/card/ResumeFileCard";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  FileText,
  BookOpen,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export type ResumeFilesProps = {
  resume_files: unknown[];
};

type ResumeFileData = {
  id: number;
  src: string;
  alt: string;
};

export const ResumeFiles = ({ resume_files }: ResumeFilesProps) => {
  const typedResumeFiles = resume_files as ResumeFileData[];

  const [showResumeFile, setShowResumeFile] = useState<ResumeFileData | null>(
    typedResumeFiles && typedResumeFiles.length > 0 ? typedResumeFiles[0] : null
  );

  const getArrayForShowResumeFileInResumeFiles = () => {
    if (!showResumeFile || !typedResumeFiles) return -1;
    return typedResumeFiles.findIndex(
      (resumeFile) => resumeFile.id === showResumeFile.id
    );
  };

  const handleDownloadResumeFiles = async () => {
    try {
      if (!typedResumeFiles || typedResumeFiles.length === 0) {
        console.error("Aucun fichier disponible pour le téléchargement.");
        return;
      }

      const downloads = typedResumeFiles.map(async (resume_file) => {
        if (!resume_file || !resume_file.src) {
          console.warn(
            "Fichier sans URL ignoré :",
            resume_file.alt || "inconnu"
          );
          return;
        }

        try {
          const response = await fetch(resume_file.src);
          if (!response.ok)
            throw new Error(`Échec du téléchargement : ${resume_file.alt}`);

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");

          a.href = url;
          a.download = resume_file.alt || "fichier_revisions";
          document.body.appendChild(a);
          a.click();

          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } catch (error) {
          console.error(
            `Erreur lors du téléchargement de ${resume_file.alt} :`,
            error
          );
        }
      });

      // Attendre que tous les téléchargements soient terminés
      await Promise.all(downloads);
    } catch (error) {
      console.error("Erreur lors du processus de téléchargement :", error);
      toast("Erreur", {
        description: "Une erreur s'est produite lors du téléchargement.",
      });
    } finally {
      toast("Téléchargement", {
        description: "Les fichiers de révision ont été téléchargés.",
      });
    }
  };

  const handleUpdateShowResumeFiles = (index: number) => {
    if (typedResumeFiles && typedResumeFiles[index]) {
      setShowResumeFile(typedResumeFiles[index]);
    }
  };

  if (!typedResumeFiles || typedResumeFiles.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex flex-col h-full border-0 shadow-lg hover:shadow-xl transition-all duration-200">
        {/* Header */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-base font-semibold text-gray-800">
              Fiches de révision
            </h3>
          </div>

          {/* Placeholder Button - Full width on new line */}
          <Button
            disabled
            className="w-full h-10 bg-gray-300 text-gray-500 border border-gray-300 font-medium rounded-xl text-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Aucune fiche disponible
          </Button>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center gap-3 h-full text-center">
          <div className="p-3 bg-blue-50 rounded-2xl">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 mb-1">
              Aucune fiche disponible
            </p>
            <p className="text-xs text-gray-500">
              Les fiches de révision apparaîtront ici une fois générées.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!showResumeFile) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex flex-col h-full border-0 shadow-lg hover:shadow-xl transition-all duration-200">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex flex-col h-full border-0 shadow-lg hover:shadow-xl transition-all duration-200">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-base font-semibold text-gray-800">
            Fiches de révision
          </h3>
          <CounterBadge counter={typedResumeFiles.length} />
        </div>

        {/* Download Button - Full width on new line */}
        <Button
          onClick={handleDownloadResumeFiles}
          className="w-full h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/60 hover:border-blue-300 font-medium rounded-xl transition-all duration-200 text-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Télécharger toutes les fiches
        </Button>
      </div>

      {/* Carousel */}
      <div className="flex items-center justify-between gap-2 flex-1">
        <Button
          onClick={() =>
            handleUpdateShowResumeFiles(
              getArrayForShowResumeFileInResumeFiles() - 1
            )
          }
          className="h-8 w-8 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/60 hover:border-blue-300 rounded-xl transition-all duration-200"
          size="icon"
          variant="ghost"
          disabled={getArrayForShowResumeFileInResumeFiles() === 0}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>

        {/* Resume File Card */}
        <div className="flex-1 max-w-[200px]">
          <ResumeFileCard resume_file={showResumeFile} />
        </div>

        <Button
          onClick={() =>
            handleUpdateShowResumeFiles(
              getArrayForShowResumeFileInResumeFiles() + 1
            )
          }
          className="h-8 w-8 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/60 hover:border-blue-300 rounded-xl transition-all duration-200"
          size="icon"
          variant="ghost"
          disabled={
            getArrayForShowResumeFileInResumeFiles() >=
            typedResumeFiles.length - 1
          }
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mt-3">
        {typedResumeFiles.map((resume_file, index) => (
          <button
            key={index}
            onClick={() => handleUpdateShowResumeFiles(index)}
            className={`rounded-full w-2 h-2 transition-all duration-200 ${
              getArrayForShowResumeFileInResumeFiles() === index
                ? "bg-blue-600 scale-125"
                : "bg-blue-300 hover:bg-blue-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
