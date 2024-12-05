import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getDaysLeft } from "@/lib/utils";

export type ExamCardProps = {
  exam: {
    id: number;
    title: string;
    description?: string;
    date: Date;
  };
  ctaSetExam: (examList: any[]) => void;
  examsList: any[];
};

// Validation schema for all form inputs
const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().optional(),
  date: z.date({ required_error: "Date is required." }),
});

export const ExamCard = (props: ExamCardProps) => {
  const { title, description, date, id } = props.exam;
  const { ctaSetExam, examsList } = props;
  const daysLeft = getDaysLeft(date);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const onSubmit = async (data: any) => {
    // Update all field values of the exam with the id in props
    const updatedExam = {
      id: id,
      title: data.title,
      description: data.description,
      date: new Date(data.date),
    };

    // Update the exam list
    const updatedExamsList = examsList.map((exam) =>
      exam.id === id ? updatedExam : exam
    );

    // Sort the exams by date
    const sortedList = updatedExamsList.sort((a: any, b: any) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    // Update the exams list in the parent component
    ctaSetExam(sortedList);
    setIsSheetOpen(false);
    toast({
      title: "Examen " + updatedExam.title + " modifié",
    });
  };

  // Handle delete exam
  const handleDelete = () => {
    const updatedExamsList = examsList.filter((exam) => exam.id !== id);
    ctaSetExam(updatedExamsList);
    setIsSheetOpen(false);
    toast({
      variant: "destructive",
      title: "Examen " + title + " supprimé",
    });
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: title,
      description: description || "",
      date: new Date(date),
    },
  });

  return (
    <div className="cursor-pointer transition-all p-5 bg-white bg-opacity-25 text-white outfit-regular rounded-lg border-2 border-white flex flex-col items-start gap-3 w-full max-w-xs min-w-xs lg:min-w-[48.5%] lg:max-w-[48.5%]">
      <div className="flex items-center justify-between w-full">
        <p className="text-md text-white text-opacity-75">
          {title.toUpperCase()}
        </p>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              onClick={() => setIsSheetOpen(true)}
              variant={"outline"}
              size={"icon"}
              className="w-8 h-8 bg-transparant border-none shadow-none hover:bg-white hover:bg-opacity-25 hover:rotate-12 rounded-full transition-all"
            >
              <Pencil className="text-white" size={4} />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full h-full flex flex-col items-start justify-start gap-2"
              >
                <SheetHeader>
                  <SheetTitle>Votre examen</SheetTitle>
                  <SheetDescription className="text-white text-opacity-50">
                    Vous pouvez modifier les informations de votre examen et
                    cliquer sur le bouton "Sauvegarder" pour enregistrer les
                    modifications. Vous pouvez également supprimer cet examen.
                  </SheetDescription>
                </SheetHeader>

                {/* Title Input */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }: { field: any }) => (
                    <FormItem className="w-full">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Type your title here"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description Input */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }: { field: any }) => (
                    <FormItem className="w-full">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type your description here."
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date Input */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }: { field: any }) => (
                    <FormItem className="w-full">
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

                {/* Annuler button */}
                <div className="w-full mt-auto">
                  <SheetClose asChild>
                    <Button
                      variant={"outline"}
                      className="w-full hover:bg-white hover:bg-opacity-5 transition-all"
                      onClick={() => {
                        form.reset();
                        setIsSheetOpen(false);
                      }}
                    >
                      Annuler
                    </Button>
                  </SheetClose>
                </div>
                {/* Submit button to edit */}
                <SheetFooter className="flex flex-col items-center w-full gap-4">
                  {/* Conteneur pour "Supprimer" et "Ajouter" */}
                  <div className="flex items-center justify-between w-full gap-2">
                    {/* Supprimer button */}
                    <Button
                      className="w-full"
                      variant={"destructive"}
                      onClick={handleDelete}
                    >
                      Supprimer
                    </Button>

                    {/* Ajouter button */}
                    <Button className="w-full" type="submit">
                      Ajouter
                    </Button>
                  </div>
                </SheetFooter>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex items-center justify-center gap-5 w-full">
        <p className="text-5xl outfit-regular">{daysLeft}</p>
        <p className="text-sm text-white text-opacity-75">
          {daysLeft === 1 ? "jour restant" : "jours restants"}
        </p>
      </div>
    </div>
  );
};
