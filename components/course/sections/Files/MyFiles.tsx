"use client";

import { useFileFetching } from "@/hooks/useFileFetching";
import { Eye, Folder } from "lucide-react";
import EmptyState from "./EmptyState";
import FileCard from "./FileCard";

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

    // Flatten all files (including unzipped ones) into a single array
    const allFiles = files.flatMap(file =>
        file.unzippedFiles && file.unzippedFiles.length > 0
            ? file.unzippedFiles
            : []
    );

    return (
        <div className="w-full h-full overflow-auto max-w-full p-6 bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50 min-h-screen text-black">
            {allFiles.length === 0 ? (
                <EmptyState type="empty" />
            ) : (
                <>
                    {/* Modern Header Section */}
                    <div className="mb-8 bg-gradient-to-br from-white/90 via-blue-50/30 to-indigo-50/30 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-blue-200/40 shadow-2xl hover:shadow-3xl hover:border-blue-300/50 transition-all duration-500 hover:scale-[1.01]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl shadow-xl transition-all duration-300 hover:scale-110">
                                    <Folder className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                                        Mes fichiers
                                    </h1>
                                    <p className="text-gray-600 text-sm mt-1">
                                        Tous vos documents en un seul endroit
                                    </p>
                                </div>
                            </div>

                            <div className="px-5 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <div className="flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-blue-600" />
                                    <span className="text-base font-bold text-blue-700">
                                        {allFiles.length} fichier{allFiles.length > 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Files Grid */}
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {allFiles.map((file, index) => (
                            <FileCard
                                key={index}
                                file={file}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
