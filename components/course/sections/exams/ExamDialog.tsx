"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Check, Plus, Trash } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    title: z
        .string()
        .min(3, { message: "Title must be at least 3 characters" }),
    description: z.string().optional(),
    date: z.date(),
});

export type ExamFormData = z.infer<typeof formSchema>;

export type ExamDialogProps = {
    courseId: string;
    exam?: ExamFormData & { _id?: string };
    createExam: (
        courseId: string,
        title: string,
        description: string,
        date: Date
    ) => void;
    updateExam?: (examId: string, data: ExamFormData) => void;
    getExams: (courseId: string[]) => void;
    updateCourseData: () => void;
    deleteExam: (examId: string, courseId: string) => void;
    isEditing?: boolean;
    triggerRef?: React.RefObject<HTMLButtonElement>;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
};

export const ExamDialog = ({
    createExam,
    updateExam,

    courseId,
    updateCourseData,
    exam,
    deleteExam,
    isEditing = false,
    triggerRef,
    isOpen,
    onOpenChange,
}: ExamDialogProps) => {
    const form = useForm<ExamFormData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: exam
            ? {
                  ...exam,
                  date: new Date(exam.date),
              }
            : {
                  title: "",
                  description: "",
                  date: new Date(),
              },
    });

    const onSubmit = async (data: ExamFormData) => {
        try {
            if (isEditing && exam?._id && updateExam) {
                await updateExam(exam._id, data);
            } else {
                await createExam(
                    courseId,
                    data.title,
                    data.description || "",
                    data.date
                );
            }
        } catch (error: unknown) {
            console.error("Error submitting form: ", error);
            toast("Erreur", {
                description:
                    "Une erreur s'est produite lors de la création de l'examen.",
            });
        } finally {
            form.reset();
            updateCourseData();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            {/* Only render trigger button if not in controlled mode */}
            {(isOpen === undefined || onOpenChange === undefined) && (
                <DialogTrigger asChild>
                    <Button
                        ref={triggerRef}
                        variant={"ghost"}
                        className="w-full lg:w-auto h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/60 hover:border-blue-300 font-medium rounded-xl transition-all duration-200 text-sm lg:flex-shrink-0 lg:whitespace-nowrap"
                    >
                        {isEditing ? (
                            <span>Modifier</span>
                        ) : (
                            <>
                                <Plus className="mr-2 h-4 w-4" />
                                Ajouter un examen
                            </>
                        )}
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[480px] lg:max-w-[520px] p-0 border-0 bg-transparent shadow-none">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
                    <DialogHeader className="text-center mb-8">
                        <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl w-fit">
                            <CalendarIcon className="w-6 h-6 text-white" />
                        </div>
                        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                            {isEditing
                                ? "Modifier l'examen"
                                : "Créer un nouvel examen"}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 mt-2 text-sm leading-relaxed">
                            {isEditing
                                ? "Modifie les détails de ton examen existant"
                                : "Planifie ton examen en remplissant les informations ci-dessous"}
                        </DialogDescription>
                    </DialogHeader>

                    <FormProvider {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-gray-700 mb-2 block">
                                            Nom de l'examen
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Bac blanc de mathématiques"
                                                    {...field}
                                                    className="h-12 px-4 bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder:text-gray-400"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormDescription className="text-xs text-gray-500 mt-2">
                                            Le nom de l'examen que tu
                                            souhaites créer
                                        </FormDescription>
                                        <FormMessage className="text-red-500 text-xs mt-1" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-gray-700 mb-2 block">
                                            Description{" "}
                                            <span className="text-gray-400 font-normal">
                                                (optionnel)
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Réviser tous les chapitres jusqu'au chapitre 5, focus sur les équations du second degré..."
                                                {...field}
                                                value={field.value || ""}
                                                className="min-h-[100px] px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder:text-gray-400 resize-none"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs text-gray-500 mt-2">
                                            Ajoute des détails sur ce qu'il
                                            faut réviser
                                        </FormDescription>
                                        <FormMessage className="text-red-500 text-xs mt-1" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-gray-700 mb-2 block">
                                            Date de l'examen
                                        </FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full h-12 px-4 bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-xl hover:bg-white/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 justify-start font-normal",
                                                            !field.value &&
                                                                "text-gray-400"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-3 h-4 w-4 text-gray-500" />
                                                        {field.value ? (
                                                            <span className="text-gray-700">
                                                                {format(
                                                                    field.value,
                                                                    "EEEE d MMMM yyyy",
                                                                    {
                                                                        locale: fr,
                                                                    }
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                Sélectionner une
                                                                date
                                                            </span>
                                                        )}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0 bg-white/95 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={date =>
                                                        date < new Date() ||
                                                        date <
                                                            new Date(
                                                                "1900-01-01"
                                                            )
                                                    }
                                                    initialFocus
                                                    className="rounded-2xl"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription className="text-xs text-gray-500 mt-2">
                                            La date prévue pour le déroulement
                                            de l'examen
                                        </FormDescription>
                                        <FormMessage className="text-red-500 text-xs mt-1" />
                                    </FormItem>
                                )}
                            />

                            <div className="flex flex-col gap-3 pt-4">
                                <DialogClose asChild>
                                    <Button
                                        disabled={!form.formState.isValid}
                                        type="submit"
                                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        {isEditing
                                            ? "Modifier l'examen"
                                            : "Créer l'examen"}
                                    </Button>
                                </DialogClose>

                                {isEditing && exam?._id && (
                                    <DialogClose asChild>
                                        <Button
                                            variant={"outline"}
                                            type="button"
                                            className="w-full h-11 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 font-medium rounded-xl transition-all duration-200"
                                            onClick={() => {
                                                deleteExam(
                                                    exam?._id || "",
                                                    courseId
                                                );
                                                return undefined;
                                            }}
                                        >
                                            <Trash className="w-4 h-4 mr-2" />
                                            Supprimer l'examen
                                        </Button>
                                    </DialogClose>
                                )}
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </DialogContent>
        </Dialog>
    );
};
