"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/date-format";
import type { VisibilityType } from "@/lib/types/visibility";
import { Visibility } from "@/lib/types/visibility";
import {
    AlertTriangle,
    BookOpen,
    Calendar,
    Eye,
    FileText,
    GraduationCap,
    ClipboardList,
    User,
    Globe,
    Lock,
    Loader2,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

export type CourseCardProps = {
    id: string;
    title: string;
    subject: string;
    level: string;
    author: string;
    createdAt: string;
    isPublished: boolean;
    visibility?: VisibilityType;
    quizzesCount?: number;
    examsCount?: number;
    summarySheetsCount?: number;
    onDelete?: (courseId: string) => Promise<boolean>;
};

export const CourseCard = ({
    id,
    title,
    subject,
    level,
    author,
    createdAt,
    isPublished = true,
    visibility = Visibility.PRIVATE,
    quizzesCount = 0,
    examsCount = 0,
    summarySheetsCount = 0,
    onDelete,
}: CourseCardProps) => {
    const router = useRouter();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = useCallback(async () => {
        if (!onDelete) return;
        setIsDeleting(true);
        const success = await onDelete(id);
        setIsDeleting(false);
        if (success) {
            setIsDeleteDialogOpen(false);
        }
    }, [onDelete, id]);

    const getSubjectColor = (subject: string) => {
        const colors = {
            Mathématiques: "bg-blue-100 text-blue-800 border-blue-200",
            Physique: "bg-purple-100 text-purple-800 border-purple-200",
            Chimie: "bg-green-100 text-green-800 border-green-200",
            Biologie: "bg-emerald-100 text-emerald-800 border-emerald-200",
            Histoire: "bg-orange-100 text-orange-800 border-orange-200",
            Géographie: "bg-yellow-100 text-yellow-800 border-yellow-200",
            Français: "bg-red-100 text-red-800 border-red-200",
            Anglais: "bg-indigo-100 text-indigo-800 border-indigo-200",
            Espagnol: "bg-pink-100 text-pink-800 border-pink-200",
            Philosophie: "bg-gray-100 text-gray-800 border-gray-200",
        };
        return (
            colors[subject as keyof typeof colors] ||
            "bg-gray-100 text-gray-800 border-gray-200"
        );
    };

    const getLevelColor = (level: string) => {
        const colors = {
            Sixième: "bg-emerald-50 text-emerald-700",
            Cinquième: "bg-teal-50 text-teal-700",
            Quatrième: "bg-cyan-50 text-cyan-700",
            Troisième: "bg-blue-50 text-blue-700",
            Seconde: "bg-indigo-50 text-indigo-700",
            Première: "bg-purple-50 text-purple-700",
            Terminale: "bg-pink-50 text-pink-700",
            TERMIIIIINALE: "bg-pink-50 text-pink-700", // Handle the existing typo
        };
        return (
            colors[level as keyof typeof colors] || "bg-gray-50 text-gray-700"
        );
    };

    return (
        <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-md bg-white/80 backdrop-blur-sm hover:bg-white/95 hover:scale-[1.03] transform-gpu">
            <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                    {/* Header Section */}
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                    <BookOpen className="w-4 h-4 text-blue-600" />
                                </div>
                                <Badge
                                    variant="secondary"
                                    className={`${getSubjectColor(subject)} text-xs font-medium border transition-all group-hover:shadow-sm`}
                                >
                                    {subject}
                                </Badge>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 leading-tight lg:truncate">
                                {title}
                            </h3>
                        </div>
                        <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                            <Link href={`/library/${id}`}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600 transform translate-x-2 group-hover:translate-x-0"
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
                            </Link>
                            {onDelete && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:text-red-600 transform translate-x-2 group-hover:translate-x-0"
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                            <GraduationCap className="w-4 h-4 text-gray-400" />
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(level)} transition-all group-hover:shadow-sm whitespace-nowrap`}
                            >
                                {level}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 min-w-0">
                            <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm font-medium truncate">
                                {author}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm whitespace-nowrap">
                                {formatDate(
                                    new Date(createdAt).toLocaleDateString(
                                        "fr-FR"
                                    )
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Status Section */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 group-hover:border-gray-200 transition-colors">
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-2 h-2 rounded-full transition-all ${isPublished ? "bg-green-500 group-hover:shadow-green-200 group-hover:shadow-lg" : "bg-yellow-500 group-hover:shadow-yellow-200 group-hover:shadow-lg"}`}
                            />
                            <span className="text-xs text-gray-500 font-medium">
                                {isPublished ? "Publié" : "Brouillon"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    router.push(`/library/${id}/settings`)
                                }
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 hover:shadow-md transform hover:scale-105 ${
                                    visibility === Visibility.PUBLIC
                                        ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                                        : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                                }`}
                            >
                                {visibility === Visibility.PUBLIC ? (
                                    <>
                                        <Globe className="w-3 h-3" />
                                        Public
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-3 h-3" />
                                        Privé
                                    </>
                                )}
                            </button>
                            <Link href={`/library/${id}`}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-300 hover:shadow-md transform hover:scale-105 whitespace-nowrap"
                                >
                                    Voir le cours
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </CardContent>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                            Supprimer le cours
                        </DialogTitle>
                        <DialogDescription>
                            Cette action est irréversible. Le cours et toutes les
                            données associées seront définitivement supprimés.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-2">
                        <p className="text-sm font-medium text-gray-900">
                            Vous allez supprimer le cours :
                        </p>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="font-semibold text-gray-900">{title}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                {subject} - {level}
                            </p>
                        </div>

                        {(quizzesCount > 0 || examsCount > 0 || summarySheetsCount > 0) && (
                            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                <p className="text-sm font-medium text-red-800 mb-2">
                                    Les éléments suivants seront également supprimés :
                                </p>
                                <ul className="space-y-1.5">
                                    {quizzesCount > 0 && (
                                        <li className="flex items-center gap-2 text-sm text-red-700">
                                            <ClipboardList className="w-4 h-4 flex-shrink-0" />
                                            {quizzesCount} quiz{quizzesCount > 1 ? "zes" : ""}
                                        </li>
                                    )}
                                    {examsCount > 0 && (
                                        <li className="flex items-center gap-2 text-sm text-red-700">
                                            <GraduationCap className="w-4 h-4 flex-shrink-0" />
                                            {examsCount} examen{examsCount > 1 ? "s" : ""}
                                        </li>
                                    )}
                                    {summarySheetsCount > 0 && (
                                        <li className="flex items-center gap-2 text-sm text-red-700">
                                            <FileText className="w-4 h-4 flex-shrink-0" />
                                            {summarySheetsCount} fiche{summarySheetsCount > 1 ? "s" : ""} de révision
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isDeleting}>
                                Annuler
                            </Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="gap-2"
                        >
                            {isDeleting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Trash2 className="w-4 h-4" />
                            )}
                            {isDeleting ? "Suppression..." : "Supprimer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
};
