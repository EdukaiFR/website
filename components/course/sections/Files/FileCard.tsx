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
        <Card className="group border border-blue-200/40 shadow-xl bg-gradient-to-br from-white/95 via-white/90 to-blue-50/30 backdrop-blur-md hover:shadow-2xl hover:border-blue-300/60 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] overflow-hidden">
            {/* Card header with icon */}
            <div className="relative bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 p-4 border-b border-blue-200/40">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center gap-3 relative">
                    <div className="relative p-2 bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative text-blue-600">
                            {getFileIcon(file.contentType)}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 truncate text-sm bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                            {file.name}
                        </h4>
                        <p className="text-xs font-medium text-blue-600 mt-0.5 px-2 py-0.5 bg-blue-50/80 rounded-md w-fit border border-blue-100">
                            {file.contentType.split("/")[1]?.toUpperCase()}
                        </p>
                    </div>
                </div>
            </div>

            <CardContent className="p-4 bg-gradient-to-br from-white/50 to-blue-50/20">
                {/* Styled metadata */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs px-3 py-2 bg-blue-50/80 rounded-lg border border-blue-100 shadow-sm">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
                        <span className="text-gray-700 font-medium">
                            {formatFileSize(file.size)}
                        </span>
                    </div>
                </div>

                {/* Modern action buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                    {isImage(file.contentType) && (
                        <ImagePreviewDialog file={file}>
                            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-xs font-semibold hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5">
                                <Eye className="w-3.5 h-3.5" />
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
                        className={`${isImage(file.contentType) ? "sm:flex-1" : "w-full"} flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-xs font-semibold hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5`}
                    >
                        <Download className="w-3.5 h-3.5" />
                        Télécharger
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
