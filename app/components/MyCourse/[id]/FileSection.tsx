"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export type FileSectionProps = {
  files: any[];
  ctaUpdate: ([]) => void;
};

export const FileSection = ({ files, ctaUpdate }: FileSectionProps) => {
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState<
    number | null
  >(null);
  const [isAddingFiles, setIsAddingFiles] = useState<boolean>(false);

  const deleteFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);

    if (fullscreenImageIndex !== null) {
      if (index === fullscreenImageIndex && updatedFiles.length === 0) {
        setFullscreenImageIndex(null);
      } else if (index === fullscreenImageIndex && updatedFiles.length > 0) {
        setFullscreenImageIndex((prev) => (prev! > 0 ? prev! - 1 : null));
      } else if (index < fullscreenImageIndex) {
        setFullscreenImageIndex((prev) => prev! - 1);
      }
    }

    ctaUpdate(updatedFiles);
  };

  const openFullscreen = (index: number) => {
    setFullscreenImageIndex(index);
  };

  const closeFullscreen = () => {
    setFullscreenImageIndex(null);
  };

  const goToPreviousImage = () => {
    if (fullscreenImageIndex !== null && fullscreenImageIndex > 0) {
      setFullscreenImageIndex(fullscreenImageIndex - 1);
    }
  };

  const goToNextImage = () => {
    if (
      fullscreenImageIndex !== null &&
      fullscreenImageIndex < files.length - 1
    ) {
      setFullscreenImageIndex(fullscreenImageIndex + 1);
    }
  };

  // Handle keyboard navigation for fullscreen images
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeFullscreen();
        setIsAddingFiles(false);
      } else if (event.key === "ArrowLeft") {
        goToPreviousImage();
      } else if (event.key === "ArrowRight") {
        goToNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullscreenImageIndex]);

  return (
    <div className="w-full max-w-[96.5%] rounded-lg bg-primary-500 bg-opacity-25 flex flex-col items-start gap-4 p-5 ml-[3.5%] mt-4">
      {/* Header */}
      <p className="text-white outfit-regular text-md">
        Tu as envoyé <span className="text-accent">{files.length}</span>{" "}
        fichiers
      </p>

      {/* Files Preview + CTA Add */}
      <div className="flex items-center justify-start gap-3 flex-wrap w-full">
        {files.map((file, index) => (
          <div
            key={index}
            className="relative group transition-all flex items-center justify-between gap-2 hover:scale-105"
          >
            <Image
              src={file.href}
              width={120}
              height={120}
              alt="file-icon"
              className="rounded-lg"
            />

            {/* Icons container */}
            <div className="absolute inset-0 p-2 flex justify-between gap-3 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity">
              {/* Fullscreen Button */}
              <Button
                onClick={() => openFullscreen(index)}
                className="flex items-center justify-center w-10 h-10 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-all"
              >
                <Maximize2 size={20} />
              </Button>

              {/* Delete Button */}
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => deleteFile(index)}
                className="transition-all px-2 py-2 bg-destructive-500 hover:bg-destructive-500 hover:bg-opacity-25 bg-opacity-25 rounded-full text-destructive-400 border-none hover:border-2 hover:border-white border-opacity-25 !shadow-none hover:text-destructive hover:rotate-12 hover:scale-125"
              >
                <Trash2 size={40} />
              </Button>
            </div>
          </div>
        ))}

        {/* Button to add files */}
        <Button
          variant={"outline"}
          size={"lg"}
          className="ml-auto mr-auto outfit-regular text-sm px-4 py-2 text-white border-2 border-white rounded-full bg-transparent hover:bg-white hover:bg-opacity-10"
          onClick={() => setIsAddingFiles(true)}
        >
          <Plus size={30} />
          Ajouter des fichiers
        </Button>
      </div>

      {/* Add file Modal */}
      {isAddingFiles && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 bg-blur-sm"
          style={{ backdropFilter: "blur(10px)" }}
        >
          <div className="w-full max-w-[50%] max-h-[90%] bg-primary-200 bg-opacity-25 rounded-lg p-5">
            <h2 className="text-white text-xl outfit-regular">
              Ajouter des fichiers
            </h2>
            {/* Close button */}
            <button
              className="absolute top-5 right-5 text-white hover:text-primary"
              onClick={() => setIsAddingFiles(false)}
            >
              <X size={30} />
            </button>

            <div className="grid w-full items-center gap-1.5">
              <Input
                className="text-white w-full text-sm lg:text-lg outfit-regular mt-8"
                multiple
                id="picture"
                type="file"
                onChange={(e) => {
                  const newFiles = e.target.files
                    ? Array.from(e.target.files).map((file) => ({
                        href: URL.createObjectURL(file),
                        name: file.name,
                      }))
                    : [];

                  ctaUpdate([...files, ...newFiles]);
                  setIsAddingFiles(false);
                }}
              />
            </div>

            {/* <input
              type="file"
              className="mt-5 rounded-full bg-transparant border-2 border-white text-white outfit-regular text-sm p-2 w-full"
              multiple
              onChange={(e) => {
                const newFiles = e.target.files
                  ? Array.from(e.target.files).map((file) => ({
                      href: URL.createObjectURL(file),
                      name: file.name,
                    }))
                  : [];

                ctaUpdate([...files, ...newFiles]);
                setIsAddingFiles(false);
              }}
            /> */}
          </div>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {fullscreenImageIndex !== null && files[fullscreenImageIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          {/* Close button */}
          <button
            className="absolute top-5 right-5 text-white hover:text-primary"
            onClick={closeFullscreen}
          >
            <X size={30} />
          </button>

          {/* Delete button */}
          <button
            className="absolute top-5 right-20 text-white hover:text-red-500 z-50 flex items-center justify-center"
            onClick={() => deleteFile(fullscreenImageIndex)}
          >
            <Trash2 size={30} />
          </button>

          {/* Previous Button */}
          {fullscreenImageIndex > 0 && (
            <button
              className="absolute left-5 text-white hover:text-primary-500"
              onClick={goToPreviousImage}
            >
              <ChevronLeft size={50} />
            </button>
          )}

          {/* Next Button */}
          {fullscreenImageIndex < files.length - 1 && (
            <button
              className="absolute right-5 text-white hover:text-primary-500"
              onClick={goToNextImage}
            >
              <ChevronRight size={50} />
            </button>
          )}

          {/* Fullscreen Image */}
          <div className="max-w-full max-h-full flex items-center justify-center p-5">
            <Image
              src={files[fullscreenImageIndex]?.href}
              layout="intrinsic"
              width={800}
              height={800}
              alt="fullscreen-image"
              className="rounded-lg max-h-screen max-w-screen"
            />
          </div>
        </div>
      )}
    </div>
  );
};
