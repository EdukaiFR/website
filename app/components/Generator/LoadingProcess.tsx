"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpRight, BookCheck, Brain, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Options = "pictures" | "files";

type GeneratorForm = {
  option: Options;
  title: string;
  subject: string;
  level: string;
  files: File[];
};

export type LoadingProcessProps = {
  formFields: GeneratorForm;
  endFct: (boolean: boolean) => void;
};

export const LoadingProcess = ({ formFields, endFct }: LoadingProcessProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // simulate loading process with 5 secondes timeout
  setTimeout(() => {
    setIsLoading(false);
  }, 3000);

  return (
    <>
      {isLoading ? (
        <>
          {/* Header */}
          <div className="flex flex-col items-center justify-center gap-2">
            <h3 className="outfit-regular text-lg lg:text-xl text-white">
              Génération en cours...
            </h3>
            <p className="text-white text-opacity-75 text-xs lg:text-md outfit-regular">
              Merci de patienter quelques instants
            </p>
          </div>

          {/* Loader */}
          <div className="flex items-center justify-center mt-4">
            <LoaderCircle className="animate-spin text-white" size={40} />
          </div>
        </>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col items-center justify-center gap-2">
            <h3 className="outfit-regular text-md lg:text-xl text-white text-center lg:text-left">
              <span className="text-accent">Félicitations</span>, la génération
              est terminée !
            </h3>
            <p className="text-white text-opacity-75 text-xs lg:text-md text-center lg:text-left outfit-regular">
              vous retrouverez ce cours dans l’onglet “Mes cours”.
            </p>
          </div>

          {/* Generation Resume */}
          <div className="flex flex-col items-center justify-center gap-4">
            {/* Quiz */}
            <div className="flex items-center justify-center gap-8 text-white">
              <Brain size={45} />
              <p className="text-md text-white text-opacity-75">62 questions</p>
            </div>

            {/* Resume Files */}
            <div className="flex items-center justify-center gap-8 text-white">
              <BookCheck size={45} />
              <p className="text-md text-white text-opacity-75">3 fiches</p>
            </div>
          </div>

          {/* Naviguate to "myCourses" */}
          <Button
            onClick={(e) => {
              e.preventDefault();
              router.push("/myCourses/12");
            }}
            className="mt-4 rounded-full text-white outfit-regular"
          >
            Voir mes cours
            <ArrowUpRight />
          </Button>
        </>
      )}
    </>
  );
};
