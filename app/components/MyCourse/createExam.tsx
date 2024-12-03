"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Validation schema for all form inputs
const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().optional(),
  date: z.date({ required_error: "Date is required." }),
});

export type createExamProps = {
  ctaAddExam: (exam: any) => void;
};

export const CreateExam = ({ ctaAddExam }: createExamProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Initialize the form using react-hook-form and zod
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
    },
  });

  // Handle form submission
  const onSubmit = async (data: any) => {
    console.log("Data from zod form", data);
    // Store the new exam in the state (not mandatory)
    const newExam = {
      title: data.title,
      description: data.description,
      date: data.date,
    };
    // call ctaAddExam to add the exam after the prev value
    ctaAddExam((prev: any) => [...prev, newExam]);
    // Close the dialog
    setIsDialogOpen(false);
    // Reset the form
    form.reset();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsDialogOpen(true)}
          variant={"outline"}
          size={"lg"}
          className="ml-auto mr-auto outfit-regular text-sm px-4 py-2 text-white border-2 border-white rounded-full bg-transparent hover:bg-white hover:bg-opacity-10"
        >
          <Plus size={30} />
          Ajouter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un examen</DialogTitle>
          <DialogDescription className="text-white text-opacity-50">
            Ajoutes un examen pour connaître le temps qu'il te restes pour
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
            {/* Date Input */}
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
            <DialogFooter className="mt-4 mb-0">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="mr-auto hover:bg-white hover:bg-opacity-10 transition-all"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
