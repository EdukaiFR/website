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
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
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
};

export const ExamDialog = ({
  createExam,
  updateExam,
  getExams,
  courseId,
  updateCourseData,
  exam,
  deleteExam,
  isEditing = false,
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
      console.log("Exam: ", exam);
      console.log(isEditing, exam?._id, updateExam);
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
    } catch (error: any) {
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
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className={
            "text-[#2D6BCF] text-sm hover:bg-[#2D6BCF]/10 hover:text-[#2D6BCF] rounded-full px-3 py-1 flex items-center gap-1"
          }
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
      <DialogContent className="sm:max-w-[425px] lg:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier un examen" : "Ajouter une date d'examen"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifie les détails de ton examen existant"
              : "Remplis le formulaire ci-dessous pour créer ton examen"}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full mx-auto flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="!text-black !text-opacity-75">
                    Nom
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Bac blanc" {...field} />
                  </FormControl>
                  <FormDescription>
                    Le nom de l'examen que tu souhaites créer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="!text-black !text-opacity-75">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Réviser tous les chapitres jusqu'au chapitre numéro 5"
                      {...field}
                      value={field.value || ""} // Convertit undefined en string vide
                    />
                  </FormControl>
                  <FormDescription>
                    Un résumé de l'examen que tu souhaites créer (optionnel).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col flex-1">
                  <FormLabel className="!text-black !text-opacity-75">
                    Date de l'examen
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl className="satoshi-regular">
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: fr })
                          ) : (
                            <span>Choisir une date</span>
                          )}

                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    La date prévue pour le déroulement de l'examen.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogClose asChild>
              <Button
                disabled={!form.formState.isValid}
                type="submit"
                className="w-full bg-gradient-to-tr from-[#2D6BCF] to-[#3678FF] text-white py-2 px-4 rounded-md hover:opacity-95 mt-auto"
              >
                <Check size={16} className="ml-2" />
                {isEditing ? "Modifier l'examen" : "Créer l'examen"}
              </Button>
            </DialogClose>
          </form>
        </FormProvider>
        <DialogClose asChild>
          {isEditing && exam?._id && (
            <Button
              variant={"destructive"}
              disabled={false}
              className="w-full"
              onClick={() => {
                deleteExam(exam?._id || "", courseId);
                return undefined;
              }}
            >
              <Trash size={16} className="ml-2" />
              Supprimer l'examen
            </Button>
          )}
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
