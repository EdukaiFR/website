"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Camera, FileUp, Trash2, WandSparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LoadingProcess } from "../components/Generator/LoadingProcess";

type Options = "pictures" | "files";

type GeneratorForm = {
  option: Options;
  title: string;
  subject: string;
  level: string;
  files: File[];
};

const formatFileSize = (size: number) => {
  return size < 1024
    ? `${size} Bytes`
    : size < 1024 * 1024
    ? `${(size / 1024).toFixed(2)} KB`
    : `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

export default function Generator() {
  const [formFields, setFormFields] = useState<GeneratorForm>({
    option: "files",
    title: "",
    subject: "",
    level: "",
    files: [],
  });
  const [isInputFilled, setIsInputFilled] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  function getFileTypeIcon(extension: string): string {
    const urlStart = "/icons/filesType/";
    switch (extension) {
      case "pdf":
        return urlStart + "pdf" + ".png";
      case "doc":
      case "docx":
        return urlStart + "doc" + ".png";
      case "jpg":
      case "jpeg":
        return urlStart + "jpg" + ".png";
      case "png":
        return urlStart + "png" + ".png";
      default:
        return urlStart + "default" + ".png";
    }
  }

  useEffect(() => {
    if (
      formFields.title !== "" &&
      formFields.subject !== "" &&
      formFields.level !== "" &&
      formFields.files.length > 0
    ) {
      setIsInputFilled(true);
    } else {
      setIsInputFilled(false);
    }
  }, [formFields]);

  const handleOptionChange = (option: Options) => {
    setFormFields((prevFields) => ({
      ...prevFields,
      option: option,
    }));
  };

  const handleTitleChange = (title: string) => {
    setFormFields((prevFields) => ({
      ...prevFields,
      title: title,
    }));
  };

  const handleSubjectChange = (subject: string) => {
    setFormFields((prevFields) => ({
      ...prevFields,
      subject: subject,
    }));
  };

  const handleLevelChange = (level: string) => {
    setFormFields((prevFields) => ({
      ...prevFields,
      level: level,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setFormFields((prevFields) => ({
        ...prevFields,
        files: [...prevFields.files, ...filesArray],
      }));
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full mb-10">
      <div className="border-2 border-[#FFFFFF] border-opacity-15 rounded-[20px] p-[30px] flex flex-col gap-5">
        {!isGenerating ? (
          <>
            {/* Header */}
            <div className="flex flex-col items-center justify-center gap-2">
              <h3 className="outfit-regular text-xl text-white">
                Bienvenue dans le{" "}
                <span className="text-accent-500">Générateur</span>
              </h3>
              <p className="text-white text-opacity-75 text-md outfit-regular">
                Veuillez sélectionner une des deux options
              </p>
            </div>

            {/* Import Option */}
            <div className="transition-all flex flex-col gap-4 items-center justify-center w-full mt-6">
              <div
                className={`transition-all w-full flex flex-row items-center gap-[60px] p-4 border-2 rounded-lg cursor-not-allowed ${
                  formFields.option === "pictures"
                    ? "border-primary-500 border-opacity-100"
                    : "border-[#FFFFFF] border-opacity-50"
                }`}
              >
                <Camera
                  size={30}
                  className={`transition-all ${
                    formFields.option === "pictures"
                      ? "text-primary-500"
                      : "text-white text-opacity-75"
                  }`}
                />
                <div className="transition-all flex flex-col gap-1 text-white outfit-regular text-left">
                  <p className="text-lg">Prendre une / des photo(s)</p>
                  <p className="text-md text-white text-opacity-75">
                    Prends des photos de ton cours, peu importe la taille de ton
                    cours !
                  </p>
                </div>
                {formFields.option === "pictures" ? (
                  <div className="ml-auto transition-all w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <div className="transition-all w-3 h-3 bg-[#FFFFFF] rounded-full" />
                  </div>
                ) : (
                  <div className="ml-auto transition-all w-6 h-6 border-2 border-[#FFFFFF] border-opacity-50 rounded-full" />
                )}
              </div>

              <div
                className={`w-full flex flex-row items-center gap-[60px] p-4 border-2 rounded-lg cursor-pointer ${
                  formFields.option === "files"
                    ? "border-primary-500 border-opacity-100"
                    : "border-[#FFFFFF] border-opacity-50"
                }`}
                onClick={() => handleOptionChange("files")}
              >
                <FileUp
                  size={30}
                  className={`${
                    formFields.option === "files"
                      ? "text-primary-500"
                      : "text-white text-opacity-75"
                  }`}
                />
                <div className="flex flex-col gap-1 text-white outfit-regular text-left">
                  <p className="text-lg">Importer tes fichiers</p>
                  <p className="text-md text-white text-opacity-75">
                    Importe un ou des fichiers pour analyser le contenu.
                  </p>
                </div>
                {formFields.option === "files" ? (
                  <div className="ml-auto w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-[#FFFFFF] rounded-full" />
                  </div>
                ) : (
                  <div className="ml-auto transition-all w-6 h-6 border-2 border-[#FFFFFF] border-opacity-50 rounded-full" />
                )}
              </div>
            </div>

            {/* File Section */}
            <div className="flex flex-col gap-2 outfit-regular text-white">
              <div className="grid w-full items-center gap-1.5">
                <Label className="text-white text-opacity-50" htmlFor="picture">
                  Fichiers
                </Label>
                <Input
                  className="text-white w-full text-lg outfit-regular"
                  multiple
                  id="picture"
                  type="file"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex flex-col gap-2 mt-4">
                {formFields.files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 px-8 py-4 rounded-lg border-2 border-white border-opacity-50"
                  >
                    <Image
                      src={getFileTypeIcon(file.name.split(".").pop() || "")}
                      width={40}
                      height={40}
                      alt="file-icon"
                    />
                    <div className="flex flex-col gap-1 items-start justify-start w-96 mr-auto ml-4">
                      <p className="text-white max-w-full truncate overflow-hidden whitespace-nowrap">
                        {file.name.split(".").slice(0, -1).join(".")}
                      </p>
                      <div className="flex items-center gap-2 text-sm opacity-50 text-white outfit-regular">
                        <p>{file.name.split(".").pop()}</p>
                        <p className="w-24 text-right">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      className="transition-all px-2 py-2 hover:bg-destructive-200 hover:bg-opacity-25 rounded-full text-destructive-400  border-none hover:border-2 hover:border-white border-opacity-25 scale-125 !shadow-none hover:text-destructive hover:rotate-12 hover:scale-150"
                      onClick={() =>
                        setFormFields((prevFields) => ({
                          ...prevFields,
                          files: prevFields.files.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <Trash2 size={30} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Section */}
            <div className="flex flex-col gap-2">
              <div className="grid w-full items-center gap-1.5">
                <Label
                  className="text-white outfit-light text-opacity-50"
                  htmlFor="text"
                >
                  Title
                </Label>
                <Input
                  className="rounded-full px-[5%] py-[3.5%] outfit-regular text-white text-lg"
                  type="text"
                  id="text"
                  placeholder="Comprendre les équations"
                  value={formFields.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label
                  className="text-white outfit-light text-opacity-50"
                  htmlFor="subject"
                >
                  Matière
                </Label>
                <Input
                  className="rounded-full px-[5%] py-[3.5%] outfit-regular text-white text-lg"
                  type="text"
                  id="subject"
                  placeholder="Mathématiques"
                  value={formFields.subject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label
                  className="text-white outfit-light text-opacity-50"
                  htmlFor="level"
                >
                  Niveau d'étude
                </Label>
                <Input
                  className="rounded-full px-[5%] py-[3.5%] outfit-regular text-white text-lg"
                  type="text"
                  id="level"
                  placeholder="Sixième"
                  value={formFields.level}
                  onChange={(e) => handleLevelChange(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={() => setIsGenerating(true)}
              disabled={!isInputFilled || isGenerating}
              className="mt-5 flex items-center justify-center gap-5 rounded-full w-full text-white outfit-regular text-md py-[3%] h-full"
            >
              <WandSparkles size={"lg"} />
              Lancer la génération !
            </Button>
          </>
        ) : (
          <LoadingProcess formFields={formFields} endFct={setIsGenerating} />
        )}
      </div>
    </div>
  );
}
