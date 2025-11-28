import { Card } from "@/components/ui/card";
import { getFileIconType } from "@/lib/file-utils";
import { ProcessedFile } from "@/lib/types/file";
import { Archive, Calendar, File } from "lucide-react";

interface FileHeaderProps {
    file: ProcessedFile;
}

const getFileIcon = (contentType: string, isZip?: boolean) => {
    const iconType = getFileIconType(contentType, isZip);
    const iconClass = "w-5 h-5";
    switch (iconType) {
        case "archive":
            return <Archive className={iconClass} />;
        case "image":
            return <File className={iconClass} />;
        case "text":
            return <File className={iconClass} />;
        default:
            return <File className={iconClass} />;
    }
};

export default function FileHeader({ file }: FileHeaderProps) {
    return (
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/95 via-white/90 to-blue-50/30 backdrop-blur-md hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] hover:border-blue-300/50 border border-blue-200/40 group">
            <div className="relative overflow-hidden rounded-2xl p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110">
                        <div className="text-blue-600">
                            {getFileIcon(file.contentType, file.isZip)}
                        </div>
                    </div>
                    <div className="flex-1 text-black">
                        <h3 className="text-xl font-bold truncate bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                            {file.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-gray-600">
                            <span className="text-sm font-medium px-3 py-1 bg-blue-50/50 rounded-lg border border-blue-100">
                                {file.contentType}
                            </span>
                            <span className="text-blue-300">•</span>
                            <div className="flex items-center gap-2 px-3 py-1 bg-purple-50/50 rounded-lg border border-purple-100">
                                <Calendar className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-medium">
                                    {new Date(
                                        file.createdAt
                                    ).toLocaleDateString("fr-FR", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
