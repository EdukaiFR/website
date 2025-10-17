"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Subject } from "@/services/subjects";

interface LevelComboboxProps {
    subjects: Subject[];
    value: string;
    onChange: (value: string) => void;
    onAddNew: () => void;
    isLoading?: boolean;
    placeholder?: string;
    className?: string;
    getLevelLabel: (levelCode: string) => string;
}

// Helper function to normalize text for search (remove accents)
function normalizeText(text: string): string {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

export function LevelCombobox({
    subjects,
    value,
    onChange,
    onAddNew,
    isLoading = false,
    placeholder = "Sélectionner un niveau...",
    className,
    getLevelLabel,
}: LevelComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    // Extract unique levels from subjects
    const levels = React.useMemo(() => {
        const levelMap = new Map<
            string,
            { code: string; label: string; count: number }
        >();

        subjects.forEach(subject => {
            if (!levelMap.has(subject.level)) {
                levelMap.set(subject.level, {
                    code: subject.level,
                    label: getLevelLabel(subject.level),
                    count: 1,
                });
            } else {
                const current = levelMap.get(subject.level)!;
                current.count++;
            }
        });

        // Convert to array and sort in logical order
        const levelOrder = [
            "Primaire",
            "Collège",
            "Lycée",
            "Terminale",
            "Post-Bac",
            "Autre",
        ];

        return Array.from(levelMap.values()).sort((a, b) => {
            const indexA = levelOrder.indexOf(a.label);
            const indexB = levelOrder.indexOf(b.label);

            // If both are in the order array, sort by that order
            if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB;
            }
            // If only one is in the order array, it comes first
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            // Otherwise, sort alphabetically
            return a.label.localeCompare(b.label);
        });
    }, [subjects, getLevelLabel]);

    // Filter levels based on search
    const filteredLevels = React.useMemo(() => {
        if (!search) return levels;

        const normalizedSearch = normalizeText(search);
        return levels.filter(
            level =>
                normalizeText(level.label).includes(normalizedSearch) ||
                normalizeText(level.code).includes(normalizedSearch)
        );
    }, [levels, search]);

    // Find the selected level
    const selectedLevel = levels.find(level => level.code === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full h-12 justify-between border-blue-200/60 focus:border-blue-600 focus:ring-blue-600/20 bg-white/80 backdrop-blur-sm font-normal text-left",
                        className
                    )}
                    disabled={isLoading}
                >
                    <span
                        className={cn(
                            "truncate",
                            !value && "text-muted-foreground"
                        )}
                    >
                        {isLoading
                            ? "Chargement..."
                            : selectedLevel
                              ? selectedLevel.label
                              : placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Rechercher un niveau..."
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        {filteredLevels.length === 0 && search && (
                            <CommandEmpty>Aucun niveau trouvé.</CommandEmpty>
                        )}
                        {filteredLevels.length > 0 && (
                            <CommandGroup heading="Niveaux d'étude">
                                {filteredLevels.map(level => (
                                    <CommandItem
                                        key={level.code}
                                        value={level.code}
                                        onSelect={() => {
                                            onChange(level.code);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === level.code
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        <span>{level.label}</span>
                                        <span className="ml-auto text-xs text-muted-foreground">
                                            {level.count}{" "}
                                            {level.count > 1
                                                ? "matières"
                                                : "matière"}
                                        </span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}

                        {/* Separator and add button */}
                        <CommandSeparator />
                        <CommandGroup>
                            <CommandItem
                                onSelect={() => {
                                    setOpen(false);
                                    onAddNew();
                                }}
                                className="text-blue-600"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Ajouter une nouvelle matière
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
