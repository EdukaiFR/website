"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/date-format";
import { FileText, Calendar, User, Eye } from "lucide-react";
import Link from "next/link";

export type PublicSheetCardProps = {
    id: string;
    title?: string;
    author: {
        firstName: string;
        lastName: string;
        username: string;
    };
    createdAt: string;
};

export const PublicSheetCard = ({
    id,
    title,
    author,
    createdAt,
}: PublicSheetCardProps) => {
    const authorName = `${author.firstName} ${author.lastName}`;
    const sheetTitle = title || `Fiche de révision`;

    return (
        <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-md bg-white/80 backdrop-blur-sm hover:bg-white/95 hover:scale-[1.03] transform-gpu">
            <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                    {/* Header Section */}
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                    <FileText className="w-4 h-4 text-purple-600" />
                                </div>
                                <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                                    Fiche de révision
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300 leading-tight lg:truncate">
                                {sheetTitle}
                            </h3>
                        </div>
                        <Link href={`/summary-sheets/${id}`}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-all duration-300 ml-4 hover:bg-purple-50 hover:text-purple-600 transform translate-x-2 group-hover:translate-x-0 flex-shrink-0"
                            >
                                <Eye className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm font-medium truncate">
                                {authorName}
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

                    {/* Action Section */}
                    <div className="flex items-center justify-end pt-3 border-t border-gray-100 group-hover:border-gray-200 transition-colors">
                        <Link href={`/summary-sheets/${id}`}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-xs hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-all duration-300 hover:shadow-md transform hover:scale-105 whitespace-nowrap"
                            >
                                Voir la fiche
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
