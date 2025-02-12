"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import { useToast } from "@/hooks/use-toast";
import { getDaysLeft } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Exam } from "../types/exam";

// Validation schema for all form inputs
export const examFormSchema = z.object({
  title: z.string()
    .min(1, { message: "Le titre est requis." })
    .max(50, { message: "Le titre peut avoir un maximum de 50 caractères." }),
  description: z.string()
    .max(200, {message: "La description peut avoir un maximum de 200 caractères."})
    .optional(),
  date: z.date({ required_error: "La date est requise." }),
});

type createExamProps = {
  courseId: string;
  examList: any[];
  onUpdateExams: (updatedExam: Exam | null, deletedExamId?: string) => void;
  createExam: (courseId: string, title: string, description: string, date: Date) => Promise<{ id: string, message: string } | null>;
};

export const CreateExam = ({ courseId, examList, onUpdateExams, createExam }: createExamProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const { toast } = useToast();

  // Initialize the form using react-hook-form and zod
  const form = useForm({
    resolver: zodResolver(examFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
    },
    mode: 'onChange'
  });

  const { formState } = form;

  useEffect(() => {
    setIsFormValid(formState.isValid);
  }, [formState.isValid]);

  // Handle exam creation
  const onSubmit = async (data: any) => {
    const daysLeft = getDaysLeft(data.date);
    if (daysLeft <= 0) {
      toast({
        title: "La date de l'examen ne peut pas être aujourd'hui ou avant.",
        description: "Veuillez choisir une date ultérieure.",
      });
      return;
    }

    const newExam = {
      _id: "",
      title: data.title,
      description: data.description,
      date: new Date(data.date),
    };

    const creationResponse = await createExam(
      courseId,
      newExam.title,
      newExam.description,
      newExam.date
    );

    if (creationResponse) {
      newExam._id = creationResponse.id;
      onUpdateExams(newExam);
    }

    // Close the modal and reset form values
    setIsDialogOpen(false);
    form.reset();

    // Toast with server's response message
    toast({
      title: creationResponse?.message || "",
      description: "Pour la date " + newExam.date.toLocaleDateString(),
    });

  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsDialogOpen(true)}
          variant={"outline"}
          size={"lg"}
          className="outfit-regular text-sm px-4 py-2 text-white border-2 border-white rounded-full bg-transparent hover:bg-white hover:bg-opacity-10 w-full lg:w-auto lg:ml-auto"
        >
          <Plus size={30} />
          Ajouter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[350px] lg:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un examen</DialogTitle>
          <DialogDescription className="text-white text-opacity-50">
            Ajoute un examen pour connaître le temps qu'il te reste pour
            apprendre ce cours.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-3 py-4"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Quel est le titre de l'examen ?"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez l'examen en quelques mots (optionnel)"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className="w-full hover:bg-white hover:bg-opacity-5 transition-all"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? field.value.toLocaleDateString()
                            : "Choisis une date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="bg-background rounded-md border border-gray-200 border-opacity-10"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4 mb-0 flex flex-col items-center w-full">
              <div className="flex items-center justify-between w-full gap-2">
                <Button
                  variant="outline"
                  className="mr-auto hover:bg-white hover:bg-opacity-10 transition-all"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={!isFormValid}>Ajouter</Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
