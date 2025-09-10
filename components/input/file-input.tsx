/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import clsx from "clsx";
import { CircleX, CloudUpload, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface FileInputProps {
    name: string;
}

export const FileInput = ({ name }: FileInputProps) => {
    const { control, setValue, watch } = useFormContext();
    const [isDragActive, setIsDragActive] = useState(false);
    const selectedFiles = watch(name) || [];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setValue(name, [...selectedFiles, ...files]);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragActive(false);
        const files = Array.from(event.dataTransfer.files);
        setValue(name, [...selectedFiles, ...files]);
    };

    useEffect(() => {
        const currentFiles = watch(name) || [];
        if (JSON.stringify(currentFiles) !== JSON.stringify(selectedFiles)) {
            setValue(name, selectedFiles);
        }
    }, [selectedFiles, setValue, name, watch]);

    return (
        <Controller
            name={name}
            control={control}
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
                                document
                                    .getElementById(`file-input-${name}`)
                                    ?.click()
                            }
                            onDragOver={e => {
                                e.preventDefault();
                                setIsDragActive(true);
                            }}
                            onDragLeave={() => setIsDragActive(false)}
                            onDrop={handleDrop}
                        >
                            <input
                                id={`file-input-${name}`}
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
                                    Drag & Drop tes fichiers ici ou clique sur
                                    le cadre
                                </p>
                            </div>
                        </div>
                    </FormControl>
                    <FormDescription>Sélectionne tes fichiers</FormDescription>
                    <FormMessage />

                    <ScrollArea
                        className="h-[200px] w-full rounded-md p-4 border"
                        hidden={selectedFiles.length === 0}
                    >
                        <div className="flex flex-col items-start gap-1 w-full">
                            {selectedFiles.map((file: File, index: number) => (
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
                                        <span className="text-sm">
                                            {file.name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {Math.round(file.size / 1024)} KB
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="ml-auto text-destructive/75 hover:text-destructive"
                                        onClick={() => {
                                            const updatedFiles =
                                                selectedFiles.filter(
                                                    (_: File, i: number) =>
                                                        i !== index
                                                );
                                            setValue(name, updatedFiles);
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
    );
};
