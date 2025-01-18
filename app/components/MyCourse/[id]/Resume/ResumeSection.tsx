"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export type ResumeSectionProps = {
  resumeFiles: { name: string; url: string }[];
  updateResumeFile: (updatedFiles: any[]) => void;
};

export const ResumeSection = ({
  resumeFiles,
  updateResumeFile,
}: ResumeSectionProps) => {
  const [files, setFiles] =
    useState<{ name: string; url: string }[]>(resumeFiles);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState<
    number | null
  >(null);

  const handleDeleteResumeFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);

    if (fullscreenImageIndex !== null) {
      if (index === fullscreenImageIndex && updatedFiles.length === 0) {
        setFullscreenImageIndex(null);
      } else if (index === fullscreenImageIndex && updatedFiles.length > 0) {
        setFullscreenImageIndex((prev) => (prev! > 0 ? prev! - 1 : null));
      } else if (index < fullscreenImageIndex) {
        setFullscreenImageIndex((prev) => prev! - 1);
      }
    }

    setFiles(updatedFiles);
    updateResumeFile(updatedFiles);
  };

  const handleDownloadResumeFile = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop() || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="w-full flex flex-row flex-wrap gap-5 items-center justify-center">
      {files.map((file, index) => (
        <div
          key={index}
          className="relative w-128 h-128" // Set relative positioning and size for each image container
        >
          {/* Image */}
          <Image
            src={file.url}
            alt={file.name}
            width={400}
            height={400}
            className="rounded-lg object-cover w-full h-full"
          />

          {/* Button to expand image */}
          <Button
            onClick={() => {
              openFullscreen(index);
            }}
            className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-75 text-gray-800 hover:bg-opacity-100"
            size={"icon"}
          >
            <Maximize2 />
          </Button>

          {/* Button to download image */}
          <Button
            onClick={() => handleDownloadResumeFile(file.url)}
            className="absolute bottom-2 right-2 p-2 rounded-full bg-white bg-opacity-75 text-gray-800 hover:bg-opacity-100"
            size={"icon"}
          >
            <Download />
          </Button>

          {/* Button to delete image */}
          <Button
            onClick={() => handleDeleteResumeFile(index)}
            className="absolute bottom-2 left-2 p-2 rounded-full bg-white bg-opacity-75 text-gray-800 hover:bg-opacity-100"
            size={"icon"}
          >
            <Trash2 />
          </Button>
        </div>
      ))}
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
            onClick={() => handleDeleteResumeFile(fullscreenImageIndex)}
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
              src={files[fullscreenImageIndex]?.url}
              layout="intrinsic"
              width={500}
              height={500}
              alt="fullscreen-image"
              className="rounded-lg max-h-screen max-w-screen"
            />
          </div>
        </div>
      )}
    </div>
  );
};
