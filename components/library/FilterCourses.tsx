"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
    Check,
    ChevronDown,
    ListFilter,
    BookOpen,
    GraduationCap,
    FileText,
} from "lucide-react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

export type FilterCoursesProps = {
    coursesFilter: {
        subjects: string[];
        levels: string[];
        titles: string[];
    };
    activeFilter: {
        type: "subject" | "level" | "title" | "";
        value: string;
    };
    setActiveFilter: (filter: {
        type: "subject" | "level" | "title" | "";
        value: string;
    }) => void;
};

const filterIcons = {
    subject: BookOpen,
    level: GraduationCap,
    title: FileText,
} as const;

const filterLabels = {
    subject: "Matière",
    level: "Niveau",
    title: "Titre",
} as const;

export const FilterCourses = ({
    coursesFilter,
    activeFilter,
    setActiveFilter,
}: FilterCoursesProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const groups = useMemo(
        () => [
            {
                label: "Matières",
                type: "subject" as const,
                options: coursesFilter.subjects,
                icon: BookOpen,
            },
            {
                label: "Niveaux",
                type: "level" as const,
                options: coursesFilter.levels,
                icon: GraduationCap,
            },
            {
                label: "Titres",
                type: "title" as const,
                options: coursesFilter.titles,
                icon: FileText,
            },
        ],
        [coursesFilter]
    );

    const totalOptions = groups.reduce(
        (acc, group) => acc + group.options.length,
        0
    );

    const ActiveIcon = activeFilter.type
        ? filterIcons[activeFilter.type]
        : ListFilter;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isOpen}
                    className={cn(
                        "h-9 justify-between gap-2 border shadow-sm transition-all duration-200",
                        activeFilter.value
                            ? "border-blue-300 bg-blue-50/50 text-blue-700 hover:bg-blue-100/50 hover:border-blue-400"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900"
                    )}
                >
                    <div className="flex items-center gap-2">
                        <ActiveIcon className="h-4 w-4 shrink-0" />
                        <span className="font-medium text-sm">
                            {activeFilter.value ? (
                                <span className="flex items-center gap-1.5">
                                    <span className="text-slate-400">
                                        {
                                            filterLabels[
                                                activeFilter.type as keyof typeof filterLabels
                                            ]
                                        }
                                        :
                                    </span>
                                    <span>{activeFilter.value}</span>
                                </span>
                            ) : (
                                "Filtrer"
                            )}
                        </span>
                    </div>
                    <ChevronDown
                        className={cn(
                            "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
                            isOpen && "rotate-180"
                        )}
                    />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-[320px] p-0 shadow-lg border-slate-200"
                align="start"
            >
                <Command className="rounded-lg">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Filtres disponibles
                        </span>
                        <Badge
                            variant="secondary"
                            className="h-5 px-1.5 text-xs font-normal bg-slate-100 text-slate-600"
                        >
                            {totalOptions}
                        </Badge>
                    </div>

                    <CommandInput
                        placeholder="Rechercher..."
                        className="h-10 border-0 focus:ring-0"
                    />

                    <CommandList className="max-h-[300px]">
                        <CommandEmpty className="py-6 text-center">
                            <div className="flex flex-col items-center gap-2">
                                <ListFilter className="h-8 w-8 text-slate-300" />
                                <p className="text-sm text-slate-500">
                                    Aucun filtre trouvé
                                </p>
                            </div>
                        </CommandEmpty>

                        {groups.flatMap((group, index) => {
                            if (group.options.length === 0) return [];

                            const GroupIcon = group.icon;
                            const elements = [];

                            if (index > 0) {
                                elements.push(
                                    <CommandSeparator
                                        key={`separator-${group.type}`}
                                        className="my-1"
                                    />
                                );
                            }

                            elements.push(
                                <CommandGroup
                                    key={group.type}
                                    heading={
                                        <div className="flex items-center justify-between px-1">
                                            <div className="flex items-center gap-2">
                                                <GroupIcon className="h-3.5 w-3.5 text-slate-400" />
                                                <span>{group.label}</span>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="h-4 px-1 text-[10px] font-normal border-slate-200 text-slate-400"
                                            >
                                                {group.options.length}
                                            </Badge>
                                        </div>
                                    }
                                    className="px-1"
                                >
                                    {group.options.map(option => {
                                        const isSelected =
                                            activeFilter.value === option &&
                                            activeFilter.type === group.type;

                                        return (
                                            <CommandItem
                                                key={`${group.type}-${option}`}
                                                value={option}
                                                keywords={[
                                                    group.label,
                                                    group.type,
                                                ]}
                                                onSelect={() => {
                                                    setActiveFilter({
                                                        type: isSelected
                                                            ? ""
                                                            : group.type,
                                                        value: isSelected
                                                            ? ""
                                                            : option,
                                                    });
                                                    setIsOpen(false);
                                                }}
                                                className={cn(
                                                    "cursor-pointer rounded-md mx-1 transition-colors",
                                                    isSelected &&
                                                        "bg-blue-50 text-blue-700"
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "flex h-4 w-4 items-center justify-center rounded border mr-2 transition-colors",
                                                        isSelected
                                                            ? "border-blue-500 bg-blue-500 text-white"
                                                            : "border-slate-300"
                                                    )}
                                                >
                                                    {isSelected && (
                                                        <Check className="h-3 w-3" />
                                                    )}
                                                </div>
                                                <span
                                                    className={cn(
                                                        "flex-1 truncate",
                                                        isSelected &&
                                                            "font-medium"
                                                    )}
                                                >
                                                    {option}
                                                </span>
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            );

                            return elements;
                        })}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
