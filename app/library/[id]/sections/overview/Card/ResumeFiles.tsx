"use client";

import { CounterBadge } from "@/components/badge/CounterBadge";
import { ResumeFileCard } from "@/components/card/ResumeFileCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import { useState } from "react";

export type ResumeFilesProps = {
  resume_files: any[];
};

export const ResumeFiles = ({ resume_files }: ResumeFilesProps) => {
  const [showResumeFile, setShowResumeFile] = useState(resume_files[0]);

  const getArrayForShowResumeFileInResumeFiles = () => {
    return resume_files.findIndex(
      (resumeFile) => resumeFile.id === showResumeFile.id
    );
  };

  const handleDownloadResumeFiles = async () => {
    try {
      if (!resume_files || resume_files.length === 0) {
        console.error("Aucun fichier disponible pour le téléchargement.");
        return;
      }

      const downloads = resume_files.map(async (resume_file) => {
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
    }
  };

  const handleUpdateShowResumeFiles = (index: number) => {
    setShowResumeFile(resume_files[index]);
  };

  return (
    <div className="bg-white rounded-lg p-4 flex flex-col items-start justify-between gap-3 h-full satoshi-medium ">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center justify-start gap-3">
          <h3 className="text-lg text-[#3C517C]">Fiches de révision</h3>
          <CounterBadge counter={resume_files.length} />
        </div>
        <Button
          onClick={handleDownloadResumeFiles}
          variant={"ghost"}
          className="text-[#2D6BCF] text-sm hover:bg-[#2D6BCF]/10 hover:text-[#2D6BCF] rounded-full px-3 py-1 flex items-center gap-1"
        >
          <Download size={16} />
          Télécharger
        </Button>
      </div>
      <div className="flex items-center justify-between gap-2 text-sm w-full">
        <Button
          onClick={() =>
            handleUpdateShowResumeFiles(
              getArrayForShowResumeFileInResumeFiles() - 1
            )
          }
          className="text-[#2D6BCF] text-sm hover:bg-[#2D6BCF]/10 hover:text-[#2D6BCF] rounded-full px-3 py-1 flex items-center gap-1"
          size={"icon"}
          variant={"ghost"}
          disabled={getArrayForShowResumeFileInResumeFiles() === 0}
        >
          <ArrowLeft />
        </Button>
        {/* Exam Carrousel */}
        <ResumeFileCard resume_file={showResumeFile} />
        <Button
          onClick={() =>
            handleUpdateShowResumeFiles(
              getArrayForShowResumeFileInResumeFiles() + 1
            )
          }
          className="text-[#2D6BCF] text-sm hover:bg-[#2D6BCF]/10 hover:text-[#2D6BCF] rounded-full px-3 py-1 flex items-center gap-1"
          size={"icon"}
          variant={"ghost"}
          disabled={
            getArrayForShowResumeFileInResumeFiles() >= resume_files.length - 1
          }
        >
          <ArrowRight />
        </Button>
      </div>
      <div className="flex items-center justify-center gap-3 w-full mt-auto">
        {resume_files.map((resume_file, index) => (
          <div
            key={index}
            onClick={() => handleUpdateShowResumeFiles(index)}
            className={
              `rounded-full w-2 h-2 cursor-pointer transition-all ` +
              (getArrayForShowResumeFileInResumeFiles() === index
                ? "bg-[#2D6BCF]"
                : "bg-[#2D6BCF] bg-opacity-25")
            }
          ></div>
        ))}
      </div>
    </div>
  );
};
