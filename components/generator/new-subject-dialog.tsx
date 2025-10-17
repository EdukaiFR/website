"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CreateSubjectData } from "@/services/subjects";

const newSubjectSchema = z.object({
    title: z
        .string()
        .min(3, "Le nom doit contenir au moins 3 caractères")
        .max(50, "Le nom ne peut pas dépasser 50 caractères"),
    level: z.string().min(1, "Veuillez sélectionner un niveau"),
});

type NewSubjectForm = z.infer<typeof newSubjectSchema>;

interface NewSubjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreateSubjectData) => Promise<void>;
    defaultLevel?: string;
}

const levels = [
    { value: "primaire", label: "Primaire" },
    { value: "cp", label: "CP" },
    { value: "ce1", label: "CE1" },
    { value: "ce2", label: "CE2" },
    { value: "cm1", label: "CM1" },
    { value: "cm2", label: "CM2" },
    { value: "collège", label: "Collège" },
    { value: "6ème", label: "6ème" },
    { value: "5ème", label: "5ème" },
    { value: "4ème", label: "4ème" },
    { value: "3ème", label: "3ème" },
    { value: "lycée", label: "Lycée" },
    { value: "seconde", label: "Seconde" },
    { value: "première", label: "Première" },
    { value: "terminale", label: "Terminale" },
    { value: "postbac", label: "Post-Bac" },
    { value: "licence", label: "Licence" },
    { value: "master", label: "Master" },
];

export function NewSubjectDialog({
    open,
    onOpenChange,
    onSubmit,
    defaultLevel = "",
}: NewSubjectDialogProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const form = useForm<NewSubjectForm>({
        resolver: zodResolver(newSubjectSchema),
        defaultValues: {
            title: "",
            level: defaultLevel,
        },
    });

    React.useEffect(() => {
        if (defaultLevel) {
            form.setValue("level", defaultLevel);
        }
    }, [defaultLevel, form]);

    async function handleSubmit(values: NewSubjectForm) {
        setIsSubmitting(true);
        try {
            await onSubmit({
                title: values.title,
                level: values.level,
            });
            form.reset();
            onOpenChange(false);
        } catch (error) {
            console.error("Error creating subject:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ajouter une nouvelle matière</DialogTitle>
                    <DialogDescription>
                        Créez une nouvelle matière pour vos cours. Elle sera
                        disponible immédiatement après création.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom de la matière</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Mathématiques"
                                            {...field}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Le nom de la matière (3 à 50 caractères)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Niveau d&apos;éducation
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={isSubmitting}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un niveau" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {levels.map(level => (
                                                <SelectItem
                                                    key={level.value}
                                                    value={level.value}
                                                >
                                                    {level.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Le niveau scolaire associé à cette
                                        matière
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Création...
                                    </>
                                ) : (
                                    "Créer la matière"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
