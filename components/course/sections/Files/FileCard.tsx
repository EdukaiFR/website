import { Card, CardContent } from "@/components/ui/card";
import {
    downloadFile,
    formatFileSize,
    getFileIconType,
    isImage,
} from "@/lib/file-utils";
import { UnzippedFile } from "@/lib/types/file";
import { Archive, Download, Eye, File, FileText, Image } from "lucide-react";
import ImagePreviewDialog from "./ImagePreviewDialog";

interface FileCardProps {
    file: UnzippedFile;
}

const getFileIcon = (contentType: string, isZip?: boolean) => {
    const iconType = getFileIconType(contentType, isZip);
    switch (iconType) {
        case "archive":
            return <Archive className="w-5 h-5" />;
        case "image":
            /* eslint-disable-next-line jsx-a11y/alt-text */
            return <Image className="w-5 h-5" />;
        case "text":
            return <FileText className="w-5 h-5" />;
        default:
            return <File className="w-5 h-5" />;
    }
};

export default function FileCard({ file }: FileCardProps) {
    return (
        <Card className="group border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
            {/* Card header with icon */}
            <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 p-4 border-b border-slate-200/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                        {getFileIcon(file.contentType)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-800 truncate text-sm">
                            {file.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {file.contentType.split("/")[1]?.toUpperCase()}
                        </p>
                    </div>
                </div>
            </div>

            <CardContent className="p-4">
                {/* Styled metadata */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-slate-600">
                            {formatFileSize(file.size)}
                        </span>
                    </div>
                </div>

                {/* Modern action buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                    {isImage(file.contentType) && (
                        <ImagePreviewDialog file={file}>
                            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
                                <Eye className="w-3 h-3" />
                                Aperçu
                            </button>
                        </ImagePreviewDialog>
                    )}

                    <button
                        onClick={() =>
                            downloadFile(
                                file.content,
                                file.name,
                                file.contentType
                            )
                        }
                        className={`${isImage(file.contentType) ? "sm:flex-1" : "w-full"} flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-xs font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105`}
                    >
                        <Download className="w-3 h-3" />
                        Télécharger
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
