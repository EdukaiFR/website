import { Badge } from "@/components/ui/badge";
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
        <Card className="border-0 shadow-xl bg-white backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
            <div className="relative overflow-hidden rounded-t-2xl bg-white p-6">
                <div className="relative flex items-center gap-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                        {getFileIcon(file.contentType, file.isZip)}
                    </div>
                    <div className="flex-1 text-black">
                        <h3 className="text-xl font-bold truncate">
                            {file.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-black/80">
                            <span className="text-sm">{file.contentType}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">
                                    {new Date(
                                        file.createdAt
                                    ).toLocaleDateString("fr-FR")}
                                </span>
                            </div>
                        </div>
                    </div>
                    {file.isZip && (
                        <Badge className="bg-white/20 text-black border-white/30 backdrop-blur-sm">
                            <Archive className="w-3 h-3 mr-1" />
                            {file.unzippedFiles?.length || 0} fichiers
                        </Badge>
                    )}
                </div>
            </div>
        </Card>
    );
}
