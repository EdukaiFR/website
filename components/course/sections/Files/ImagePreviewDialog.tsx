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
            <DialogContent className="max-w-6xl w-[95vw] h-[95vh] p-0 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border-0 shadow-2xl">
                <div className="flex flex-col h-full">
                    <DialogHeader className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-slate-200/50">
                        <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-slate-800">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                <Image className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="truncate">{file.name}</div>
                                <div className="text-sm font-normal text-slate-500 mt-1">
                                    {file.contentType} •{" "}
                                    {formatFileSize(file.size)}
                                </div>
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 flex items-center justify-center p-6 min-h-0">
                        <div className="relative w-full h-full flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 rounded-2xl"></div>
                            <div className="relative max-w-full max-h-full">
                                <img
                                    src={`data:${file.contentType};base64,${file.content}`}
                                    alt={file.name}
                                    className="max-w-full max-h-full object-contain rounded-xl shadow-lg border border-white/50"
                                    style={{
                                        maxHeight: "calc(95vh - 200px)",
                                        filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.1))",
                                    }}
                                />
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none"></div>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-white/60 backdrop-blur-sm border-t border-slate-200/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 rounded-full">
                                    <File className="w-4 h-4 text-slate-600" />
                                    <span className="text-sm font-medium text-slate-700">
                                        {file.name
                                            .split(".")
                                            .pop()
                                            ?.toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/80 rounded-full">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-blue-700">
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
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <Download className="w-4 h-4" />
                                <span className="font-medium">Télécharger</span>
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
