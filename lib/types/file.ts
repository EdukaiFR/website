export interface FileData {
    _id: string;
    name: string;
    contentType: string;
    fileContent: string;
    fileType: string;
    createdAt: string;
    updatedAt: string;
}

export interface UnzippedFile {
    name: string;
    content: string;
    contentType: string;
    size: number;
}

export interface ProcessedFile extends FileData {
    unzippedFiles?: UnzippedFile[];
    isZip?: boolean;
    decompressionSuccessful?: boolean;
}
