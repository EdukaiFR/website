"use client";

import { FileInput } from "@/components/input/file-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Plus } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const fileSchema = z.custom<File>((value) => {
  return value instanceof File;
}, "Expected a File object");

const formSchema = z.object({
  files: z.array(fileSchema).min(1, { message: "Files are required." }),
});

export type AddResumeFileProps = {};

export const AddResumeFile = (props: AddResumeFileProps) => {
  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  });

  const onSubmit = async (data: any) => {
    try {
      // TODO: call hooks to add resumeFile(s)
    } catch (error: any) {
      console.error("Error submitting resumeFile(s) form: ", error);
      toast.error("Error submitting resumeFile(s) form: ", error);
    } finally {
      form.reset();
      toast.success("Fiches de révision ajoutées avec succès.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="text-[#2D6BCF] text-sm hover:bg-[#2D6BCF]/10 hover:text-[#2D6BCF] rounded-full px-3 py-1 flex items-center gap-1"
          onClick={() => {}}
        >
          <Plus size={16} />
          Ajouter
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Ajouter une fiche de révision</DialogTitle>
          <DialogDescription>
            Remplis le formulaire ci-dessous pour ajouter tes propres fiches de
            révision.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full mx-auto flex flex-col gap-4"
          >
            <FileInput name="files" />

            <Button
              disabled={!form.watch("files").length}
              type="submit"
              className="bg-gradient-to-tr from-[#2D6BCF] to-[#3678FF] text-white py-2 px-4 rounded-md hover:opacity-95 mt-auto"
            >
              <Check size={16} className="mr-2" />
              Confirmer
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
