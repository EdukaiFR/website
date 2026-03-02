"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronsUpDown,
  Loader2,
  Send,
} from "lucide-react";
import { FileDropzone } from "@/components/ticket/file-dropzone";
import { TypeCardGrid } from "@/components/ticket/type-card-grid";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useDraftPersistence, useSession, useTicketConfig } from "@/hooks";
import { cn } from "@/lib/utils";
import {
  CATEGORY_LABELS,
  URGENCY_LABELS,
  translateLabel,
} from "@/lib/constants/ticket";
import { createTicketSchema } from "@/lib/schemas/ticket";
import type { CreateTicketFormValues } from "@/lib/schemas/ticket";
import { ticketToast } from "@/lib/toast";
import { isApiSuccess } from "@/lib/types/api";
import type { TicketConfigValue } from "@/lib/types/ticket";
import { convertFilesToAttachments } from "@/lib/utils/file-upload";
import { useTicketService } from "@/services/ticket";

interface ComboboxFieldProps {
  options: TicketConfigValue[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  disabled?: boolean;
  labels: Record<string, string>;
}

function ComboboxField({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  disabled = false,
  labels,
}: ComboboxFieldProps) {
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
            "h-12 w-full justify-between font-normal border-blue-200/60 bg-white/80 backdrop-blur-sm",
            !value && "text-muted-foreground"
          )}
        >
          {displayLabel ?? placeholder}
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
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => {
                const label = translateLabel(opt.key, labels, opt.label);
                return (
                  <CommandItem
                    key={opt.key}
                    value={label}
                    onSelect={() => {
                      onChange(opt.key);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    {label}
                    {value === opt.key && (
                      <Check className="ml-auto h-4 w-4 text-primary" />
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function captureBrowserContext(): string {
  if (typeof window === "undefined") return "";
  return `${navigator.userAgent} | ${window.innerWidth}x${window.innerHeight} | ${window.location.href}`;
}

export default function NewTicketPage() {
  const router = useRouter();
  const session = useSession();
  const ticketService = useTicketService();
  const {
    types,
    categories,
    urgencies,
    isLoading: configLoading,
  } = useTicketConfig(ticketService);

  const form = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      category: "",
      clientUrgency: "",
      tags: [],
    },
  });

  const { hasDraft, clearDraft } = useDraftPersistence(form);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: CreateTicketFormValues) => {
    setIsSubmitting(true);
    try {
      const processedAttachments = await convertFilesToAttachments(
        attachments,
        session.user?._id ?? ""
      );

      const browserContext = captureBrowserContext();
      const enrichedDescription = browserContext
        ? `${values.description}\n\n---\nContext: ${browserContext}`
        : values.description;

      const result = await ticketService.createTicket({
        ...values,
        description: enrichedDescription,
        attachments: processedAttachments,
      });

      if (isApiSuccess(result)) {
        ticketToast.createSuccess();
        clearDraft();
        form.reset();
        setAttachments([]);
        if (result.data?.reference) {
          router.push(`/tickets/${result.data.reference}`);
        } else {
          router.push("/support");
        }
      } else {
        ticketToast.createError(result.message);
      }
    } catch (error: unknown) {
      const err = error as Error;
      ticketToast.createError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled =
    isSubmitting || (!form.formState.isDirty && !hasDraft) || configLoading;

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-8 py-6 min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link
            href="/support"
            className="flex items-center justify-center h-10 w-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Nouveau ticket
            </h1>
            <p className="text-gray-600 mt-0.5">
              Décrivez votre problème et nous vous aiderons rapidement.
            </p>
          </div>
        </div>

        {hasDraft && !form.formState.isDirty && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              Un brouillon a été restauré depuis votre dernière visite.
            </span>
            <button
              type="button"
              onClick={() => {
                clearDraft();
                form.reset();
              }}
              className="ml-auto text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Supprimer
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 shadow-sm">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-semibold">
                      Type de demande
                    </FormLabel>
                    <FormControl>
                      <TypeCardGrid
                        types={types}
                        selectedType={field.value}
                        onSelect={field.onChange}
                        isLoading={configLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-semibold">
                      Titre
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Résumez votre demande en une phrase"
                        className="h-12 border-blue-200/60 focus:border-blue-600 focus:ring-blue-600/20 bg-white/80 backdrop-blur-sm"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-semibold">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez votre problème en détail. Plus vous êtes précis, plus nous pourrons vous aider rapidement."
                        rows={8}
                        className="border-blue-200/60 focus:border-blue-600 focus:ring-blue-600/20 bg-white/80 backdrop-blur-sm resize-none"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-semibold">
                        Catégorie
                      </FormLabel>
                      <FormControl>
                        <ComboboxField
                          options={categories}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Sélectionnez une catégorie"
                          searchPlaceholder="Rechercher une catégorie..."
                          emptyMessage="Aucune catégorie trouvée."
                          disabled={isSubmitting || configLoading}
                          labels={CATEGORY_LABELS}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientUrgency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-semibold">
                        Urgence
                      </FormLabel>
                      <FormControl>
                        <ComboboxField
                          options={urgencies}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Sélectionnez l'urgence"
                          searchPlaceholder="Rechercher un niveau..."
                          emptyMessage="Aucun niveau trouvé."
                          disabled={isSubmitting || configLoading}
                          labels={URGENCY_LABELS}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  Pièces jointes
                </p>
                <FileDropzone
                  files={attachments}
                  onFilesChange={setAttachments}
                  maxFiles={5}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/support")}
                  disabled={isSubmitting}
                  className="h-12 flex-1 rounded-xl"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isFormDisabled}
                  className="h-12 flex-[2] bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Envoi en cours...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Envoyer le ticket
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
