/* eslint-disable jsx-a11y/alt-text, @next/next/no-img-element */
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { downloadFile, formatFileSize } from "@/lib/file-utils";
import { UnzippedFile } from "@/lib/types/file";
import { Download, File, Image } from "lucide-react";

interface ImagePreviewDialogProps {
    file: UnzippedFile;
    children: React.ReactNode;
}

export default function ImagePreviewDialog({
    file,
    children,
}: ImagePreviewDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-blue-100/40 border border-blue-100/50 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-col h-full max-h-[95vh]">
                    <DialogHeader className="px-6 py-5 bg-white/90 backdrop-blur-md border-b border-blue-100/50 flex-shrink-0">
                        <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                            <div className="p-2.5 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg">
                                <Image className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="truncate bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent">
                                    {file.name}
                                </div>
                                <div className="text-sm font-medium text-gray-600 mt-1">
                                    {file.contentType} •{" "}
                                    {formatFileSize(file.size)}
                                </div>
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 flex items-center justify-center p-6 min-h-0 overflow-hidden bg-gradient-to-br from-blue-50/20 to-blue-100/30">
                        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                            <img
                                src={`data:${file.contentType};base64,${file.content}`}
                                alt={file.name}
                                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border-2 border-blue-100/50 hover:border-blue-200 transition-all duration-300"
                                style={{
                                    maxHeight: "calc(95vh - 250px)",
                                    filter: "drop-shadow(0 10px 25px rgba(59, 130, 246, 0.1))",
                                }}
                            />
                        </div>
                    </div>

                    <div className="px-6 py-5 bg-white/90 backdrop-blur-md border-t border-blue-100/50 flex-shrink-0">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50/80 rounded-xl border border-blue-100 shadow-sm">
                                    <File className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-bold text-blue-700">
                                        {file.name
                                            .split(".")
                                            .pop()
                                            ?.toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50/80 rounded-xl border border-blue-100 shadow-sm">
                                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-bold text-blue-700">
                                        {formatFileSize(file.size)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    downloadFile(
                                        file.content,
                                        file.name,
                                        file.contentType
                                    )
                                }
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                            >
                                <Download className="w-4 h-4" />
                                <span>Télécharger</span>
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
