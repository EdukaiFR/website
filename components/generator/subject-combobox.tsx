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

interface SubjectComboboxProps {
    subjects: Subject[];
    groupedSubjects: Record<string, Subject[]>;
    value: string;
    onChange: (value: string) => void;
    onAddNew: () => void;
    isLoading?: boolean;
    placeholder?: string;
    className?: string;
    getLevelLabel: (levelCode: string) => string;
    selectedLevel?: string;
    disabled?: boolean;
}

// Helper function to normalize text for search (remove accents)
function normalizeText(text: string): string {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

// Smart search function that handles multiple criteria and partial matches
function matchesSearch(
    subject: Subject,
    searchTerms: string[],
    getLevelLabel: (code: string) => string
): boolean {
    // For multi-word search, ALL terms must match somewhere
    return searchTerms.every(term => {
        const normalizedTerm = normalizeText(term);

        const titleNormalized = normalizeText(subject.title);
        const codeNormalized = normalizeText(subject.code);
        const levelNormalized = normalizeText(getLevelLabel(subject.level));

        const titleMatch = titleNormalized.includes(normalizedTerm);
        const codeMatch = codeNormalized.includes(normalizedTerm);
        const levelMatch = levelNormalized.includes(normalizedTerm);

        // Check if term matches in any of these fields
        return titleMatch || codeMatch || levelMatch;
    });
}

export function SubjectCombobox({
    subjects,
    groupedSubjects,
    value,
    onChange,
    onAddNew,
    isLoading = false,
    placeholder = "Sélectionner une matière...",
    className,
    getLevelLabel,
    selectedLevel,
    disabled = false,
}: SubjectComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    // Filter subjects by selected level first
    const levelFilteredSubjects = React.useMemo(() => {
        if (!selectedLevel) return subjects;
        return subjects.filter(subject => subject.level === selectedLevel);
    }, [subjects, selectedLevel]);

    // Create grouped subjects from filtered list
    const levelFilteredGroups = React.useMemo(() => {
        if (!selectedLevel) return groupedSubjects || {};

        const filtered: Record<string, Subject[]> = {};
        const levelLabel = getLevelLabel(selectedLevel);

        if (groupedSubjects && groupedSubjects[levelLabel]) {
            filtered[levelLabel] = groupedSubjects[levelLabel];
        }

        return filtered;
    }, [groupedSubjects, selectedLevel, getLevelLabel]);

    // Find the selected subject by code (unique identifier)
    const selectedSubject = levelFilteredSubjects.find(
        subject => subject.code === value
    );

    // Filter subjects based on search
    const filteredGroups = React.useMemo(() => {
        const baseGroups = levelFilteredGroups;

        if (!search) return baseGroups;

        // Split search into terms (by spaces) for multi-criteria search
        const searchTerms = search
            .trim()
            .split(/\s+/)
            .filter(term => term.length > 0);
        if (searchTerms.length === 0) return baseGroups;

        const filtered: Record<string, Subject[]> = {};
        Object.entries(baseGroups).forEach(([level, levelSubjects]) => {
            // Add defensive check for levelSubjects
            if (!levelSubjects || !Array.isArray(levelSubjects)) {
                return;
            }

            const matchingSubjects = levelSubjects.filter(subject =>
                matchesSearch(subject, searchTerms, getLevelLabel)
            );
            if (matchingSubjects.length > 0) {
                filtered[level] = matchingSubjects;
            }
        });

        return filtered;
    }, [levelFilteredGroups, search, getLevelLabel]);

    const hasResults = Object.keys(filteredGroups).length > 0;

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
                    disabled={
                        isLoading ||
                        disabled ||
                        (!selectedLevel &&
                            placeholder === "Sélectionner une matière...")
                    }
                >
                    <span
                        className={cn(
                            "truncate",
                            !value && "text-muted-foreground"
                        )}
                    >
                        {isLoading
                            ? "Chargement..."
                            : !selectedLevel
                              ? "Sélectionnez d'abord un niveau"
                              : selectedSubject
                                ? selectedSubject.title
                                : placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Rechercher une matière..."
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        {!hasResults && search && (
                            <CommandEmpty>Aucune matière trouvée.</CommandEmpty>
                        )}
                        {hasResults &&
                            Object.entries(filteredGroups)
                                .sort(([a], [b]) => {
                                    // Sort levels in a logical order
                                    const levelOrder = [
                                        "Primaire",
                                        "Collège",
                                        "Lycée",
                                        "Terminale",
                                        "Post-Bac",
                                        "Autre",
                                    ];
                                    return (
                                        levelOrder.indexOf(a) -
                                        levelOrder.indexOf(b)
                                    );
                                })
                                .map(([level, levelSubjects]) => {
                                    // Add defensive check for levelSubjects
                                    if (
                                        !levelSubjects ||
                                        !Array.isArray(levelSubjects)
                                    ) {
                                        return null;
                                    }

                                    return (
                                        <CommandGroup
                                            key={level}
                                            heading={level}
                                        >
                                            {levelSubjects.map(subject => (
                                                <CommandItem
                                                    key={subject._id}
                                                    value={subject._id}
                                                    onSelect={() => {
                                                        onChange(subject.code);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            value ===
                                                                subject.code
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                    <span>{subject.title}</span>
                                                    <span className="ml-auto text-xs text-muted-foreground">
                                                        {subject.code}
                                                    </span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    );
                                })
                                .filter(Boolean)}

                        {/* Always show the separator and add button */}
                        {(hasResults || search) && <CommandSeparator />}

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
