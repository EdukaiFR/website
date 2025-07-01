"use client";

import { useFileFetching } from "@/hooks/useFileFetching";
import { Eye } from "lucide-react";
import EmptyState from "./EmptyState";
import FileCard from "./FileCard";
import FileHeader from "./FileHeader";

interface MyFilesProps {
    courseId: string;
    getCourseFiles: (courseId: string) => Promise<unknown>;
}

export default function MyFiles({ courseId, getCourseFiles }: MyFilesProps) {
    const { files, loading, error } = useFileFetching({
        courseId,
        getCourseFiles,
    });

    if (loading) return <EmptyState type="loading" />;
    if (error) return <EmptyState type="error" message={error} />;

    return (
        <div className="w-full h-full overflow-auto max-w-full p-6 bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50 min-h-screen text-black">
            {files.length === 0 ? (
                <EmptyState type="empty" />
            ) : (
                <div className="space-y-8">
                    {files.map(file => (
                        <div key={file._id} className="space-y-0 text-black">
                            <FileHeader file={file} />

                            {file.isZip &&
                                file.unzippedFiles &&
                                file.unzippedFiles.length > 0 && (
                                    <div className="relative">
                                        <div className="absolute left-6 top-0 w-0.5 h-full bg-gradient-to-b from-blue-200 to-transparent"></div>
                                        <div className="ml-12 pt-4">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                                                    <Eye className="w-4 h-4 text-white" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-slate-800">
                                                    Contenu décompressé
                                                </h3>
                                                <div className="h-px bg-gradient-to-r from-slate-200 to-transparent flex-1"></div>
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                                {file.unzippedFiles.map(
                                                    (unzippedFile, index) => (
                                                        <FileCard
                                                            key={index}
                                                            file={unzippedFile}
                                                        />
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
