"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/date-format";
import { Calendar, User, Eye, LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export type PublicContentCardProps = {
    title: string;
    author: {
        firstName: string;
        lastName: string;
        username: string;
    };
    createdAt: string;
    href: string;
    icon: LucideIcon;
    iconColor: "blue" | "purple";
    badges?: ReactNode;
    actionText: string;
};

export const PublicContentCard = ({
    title,
    author,
    createdAt,
    href,
    icon: Icon,
    iconColor,
    badges,
    actionText,
}: PublicContentCardProps) => {
    const authorName = `${author.firstName} ${author.lastName}`;

    const colorClasses = {
        blue: {
            iconBg: "bg-blue-100 group-hover:bg-blue-200",
            iconText: "text-blue-600",
            titleHover: "group-hover:text-blue-600",
            buttonHover: "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200",
        },
        purple: {
            iconBg: "bg-purple-100 group-hover:bg-purple-200",
            iconText: "text-purple-600",
            titleHover: "group-hover:text-purple-600",
            buttonHover: "hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200",
        },
    };

    const colors = colorClasses[iconColor];

    return (
        <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-md bg-white/80 backdrop-blur-sm hover:bg-white/95 hover:scale-[1.03] transform-gpu">
            <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                    {/* Header Section */}
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-3">
                                <div className={`p-1.5 ${colors.iconBg} rounded-lg transition-colors`}>
                                    <Icon className={`w-4 h-4 ${colors.iconText}`} />
                                </div>
                                {badges}
                            </div>
                            <h3 className={`text-lg font-semibold text-gray-900 ${colors.titleHover} transition-colors duration-300 leading-tight lg:truncate`}>
                                {title}
                            </h3>
                        </div>
                        <Link href={href}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`opacity-0 group-hover:opacity-100 transition-all duration-300 ml-4 ${colors.buttonHover} transform translate-x-2 group-hover:translate-x-0 flex-shrink-0`}
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
                        <Link href={href}>
                            <Button
                                variant="outline"
                                size="sm"
                                className={`text-xs ${colors.buttonHover} transition-all duration-300 hover:shadow-md transform hover:scale-105 whitespace-nowrap`}
                            >
                                {actionText}
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
