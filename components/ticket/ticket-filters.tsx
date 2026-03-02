"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, RotateCcw, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TicketConfigValue } from "@/lib/types/ticket";
import {
  STATUS_LABELS,
  TYPE_LABELS,
  CATEGORY_LABELS,
  URGENCY_LABELS,
  translateLabel,
} from "@/lib/constants/ticket";

export interface TicketFilterValues {
  search: string;
  status: string;
  type: string;
  category: string;
  urgency: string;
}

export const DEFAULT_FILTERS: TicketFilterValues = {
  search: "",
  status: "",
  type: "",
  category: "",
  urgency: "",
};

interface TicketFiltersProps {
  filters: TicketFilterValues;
  onFiltersChange: (filters: TicketFilterValues) => void;
  config: {
    types: TicketConfigValue[];
    categories: TicketConfigValue[];
    urgencies: TicketConfigValue[];
  };
  isLoading?: boolean;
}

const SEARCH_DEBOUNCE_MS = 300;

const STATUS_OPTIONS = [
  { key: "open", label: "Ouvert" },
  { key: "in_progress", label: "En cours" },
  { key: "waiting_for_client", label: "En attente" },
  { key: "resolved", label: "Résolu" },
  { key: "closed", label: "Fermé" },
];

/**
 * Filter bar for the tickets list page with search and combobox filters.
 * @param filters - Current filter values
 * @param onFiltersChange - Callback when any filter changes
 * @param config - Ticket configuration values for populating dropdowns
 * @param isLoading - Disable filters while config is loading
 */
export function TicketFilters({
  filters,
  onFiltersChange,
  config,
  isLoading = false,
}: TicketFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFiltersChange({ ...filters, search: searchInput });
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchInput]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateFilter = useCallback(
    (key: keyof TicketFilterValues, value: string) => {
      onFiltersChange({ ...filters, [key]: value });
    },
    [filters, onFiltersChange]
  );

  const hasActiveFilters =
    filters.status !== "" ||
    filters.type !== "" ||
    filters.category !== "" ||
    filters.urgency !== "" ||
    filters.search !== "";

  const handleReset = useCallback(() => {
    setSearchInput("");
    onFiltersChange(DEFAULT_FILTERS);
  }, [onFiltersChange]);

  return (
    <div className="flex flex-col gap-3">
      <div className="group flex items-center gap-3 h-11 rounded-xl border border-gray-200 bg-white px-4 shadow-sm transition-all focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
        <Search className="h-[18px] w-[18px] text-gray-400 group-focus-within:text-blue-500 transition-colors shrink-0" />
        <input
          type="text"
          placeholder="Rechercher par titre ou référence..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          disabled={isLoading}
          className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => setSearchInput("")}
            className="flex items-center justify-center h-5 w-5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shrink-0"
          >
            <X className="h-3 w-3 text-gray-500" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
          <FilterCombobox
            value={filters.status}
            onChange={(v) => updateFilter("status", v)}
            placeholder="Statut"
            searchPlaceholder="Rechercher un statut..."
            options={STATUS_OPTIONS}
            labels={STATUS_LABELS}
            disabled={isLoading}
          />
          <FilterCombobox
            value={filters.type}
            onChange={(v) => updateFilter("type", v)}
            placeholder="Type"
            searchPlaceholder="Rechercher un type..."
            options={config.types.map((t) => ({
              key: t.key,
              label: translateLabel(t.key, TYPE_LABELS, t.label),
            }))}
            labels={TYPE_LABELS}
            disabled={isLoading}
          />
          <FilterCombobox
            value={filters.category}
            onChange={(v) => updateFilter("category", v)}
            placeholder="Catégorie"
            searchPlaceholder="Rechercher une catégorie..."
            options={config.categories.map((c) => ({
              key: c.key,
              label: translateLabel(c.key, CATEGORY_LABELS, c.label),
            }))}
            labels={CATEGORY_LABELS}
            disabled={isLoading}
          />
          <FilterCombobox
            value={filters.urgency}
            onChange={(v) => updateFilter("urgency", v)}
            placeholder="Urgence"
            searchPlaceholder="Rechercher une urgence..."
            options={config.urgencies.map((u) => ({
              key: u.key,
              label: translateLabel(u.key, URGENCY_LABELS, u.label),
            }))}
            labels={URGENCY_LABELS}
            disabled={isLoading}
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-700 shrink-0"
          >
            <RotateCcw className="h-4 w-4 mr-1.5" />
            Réinitialiser
          </Button>
        )}
      </div>
    </div>
  );
}

interface FilterComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  options: { key: string; label: string }[];
  labels: Record<string, string>;
  disabled?: boolean;
}

function FilterCombobox({
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  options,
  labels,
  disabled = false,
}: FilterComboboxProps) {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.key === value);
  const displayLabel = selected
    ? translateLabel(selected.key, labels, selected.label)
    : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-10 w-full justify-between font-normal border-gray-200 bg-white/80 backdrop-blur-sm",
            !value && "text-muted-foreground"
          )}
        >
          <span className="truncate">
            {displayLabel ?? placeholder}
          </span>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>Aucun résultat.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="__all__"
                onSelect={() => {
                  onChange("");
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                Tous
                {value === "" && (
                  <Check className="ml-auto h-4 w-4 text-primary" />
                )}
              </CommandItem>
              {options.map((opt) => (
                <CommandItem
                  key={opt.key}
                  value={opt.label}
                  onSelect={() => {
                    onChange(opt.key === value ? "" : opt.key);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  {opt.label}
                  {value === opt.key && (
                    <Check className="ml-auto h-4 w-4 text-primary" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
