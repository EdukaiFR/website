"use client";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, ListFilter } from "lucide-react";
import { useMemo } from "react";

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
    isFilterOpen: boolean;
    setFilterOpen: (isOpen: boolean) => void;
};

export const FilterCourses = ({
    coursesFilter,
    activeFilter,
    setActiveFilter,
    isFilterOpen,
    setFilterOpen,
}: FilterCoursesProps) => {
    const groups = useMemo(
        () => [
            {
                label: "Matières",
                type: "subject" as const,
                options: coursesFilter.subjects,
            },
            {
                label: "Niveaux",
                type: "level" as const,
                options: coursesFilter.levels,
            },
            {
                label: "Titres",
                type: "title" as const,
                options: coursesFilter.titles,
            },
        ],
        [coursesFilter]
    );

    return (
        <Popover open={isFilterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isFilterOpen}
                    className="w-fit justify-between border border-blue-200/60 text-blue-600 hover:bg-blue-50/80 hover:border-indigo-300 transition-all hover:text-indigo-600 min-w-0 px-2 lg:px-3"
                >
                    <div className="flex items-center justify-start gap-1 lg:gap-2 min-w-0">
                        <ListFilter className="h-4 w-4 shrink-0" />
                        <span className="font-medium text-sm truncate max-w-[80px] lg:max-w-none">
                            {activeFilter.value
                                ? `${activeFilter.value}`
                                : "Filtre"}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 lg:gap-2 ml-1 lg:ml-2 flex-shrink-0">
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </div>
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Rechercher un filtre..." />
                    <CommandList>
                        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>

                        {groups.map(group => (
                            <CommandGroup
                                key={group.type}
                                heading={group.label}
                            >
                                {group.options.map(option => (
                                    <CommandItem
                                        key={`${group.type}-${option}`}
                                        className="cursor-pointer"
                                        value={option}
                                        onSelect={() => {
                                            setActiveFilter({
                                                type:
                                                    activeFilter.value ===
                                                    option
                                                        ? ""
                                                        : group.type,
                                                value:
                                                    activeFilter.value ===
                                                    option
                                                        ? ""
                                                        : option,
                                            });
                                            setFilterOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                activeFilter.value === option &&
                                                    activeFilter.type ===
                                                        group.type
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {option}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
