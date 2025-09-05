"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks";
import type { 
    CreateTicketRequest,
    TicketCategory,
    TicketPriority,
    TicketSeverity
} from "@/lib/types/ticket";
import { TicketPriority as TicketPriorityEnum } from "@/lib/types/ticket";

export interface CreateTicketDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (ticketData: CreateTicketRequest) => Promise<unknown>;
    isCreating?: boolean;
}

export const CreateTicketDialog: React.FC<CreateTicketDialogProps> = ({
    open,
    onOpenChange,
    onSubmit,
    isCreating = false
}) => {
    const { user } = useSession();
    
    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<TicketCategory | "">("");
    const [priority, setPriority] = useState<TicketPriority>(TicketPriorityEnum.P2);
    const [severity, setSeverity] = useState<TicketSeverity | "">("");
    
    // Error state
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (open) {
            setTitle("");
            setDescription("");
            setCategory("");
            setPriority(TicketPriorityEnum.P2);
            setSeverity("");
            setErrors({});
        }
    }, [open]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!title.trim()) {
            newErrors.title = "Le titre est requis";
        }

        if (!description.trim()) {
            newErrors.description = "La description est requise";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            // Build context
            const context = {
                pageUrl: window.location.href,
                userAgent: navigator.userAgent,
                locale: navigator.language,
                viewport: {
                    w: window.innerWidth,
                    h: window.innerHeight
                }
            };

            // Build request
            const ticketData: CreateTicketRequest = {
                title: title.trim(),
                description: description.trim(),
                context,
                ...(category && { category: category as TicketCategory }),
                ...(severity && { severityPerceived: severity as TicketSeverity }),
                priority
            };

            await onSubmit(ticketData);
            onOpenChange(false);
        } catch (error) {
            console.error("Error creating ticket:", error);
        }
    };

    const handleClose = () => {
        if (!isCreating) {
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-blue-600" />
                        </div>
                        Créer un ticket de support
                    </DialogTitle>
                    <p className="text-sm text-gray-600 mt-2">
                        Décrivez votre problème et notre équipe vous répondra rapidement.
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                            Titre du problème *
                        </Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Impossible de télécharger mes documents"
                            className={cn(
                                "bg-gray-50 border-gray-200 focus:bg-white transition-colors",
                                errors.title && "border-red-300 focus:border-red-500"
                            )}
                            disabled={isCreating}
                        />
                        {errors.title && (
                            <p className="text-sm text-red-600">{errors.title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                            Description détaillée *
                        </Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Décrivez votre problème en détail..."
                            rows={4}
                            className={cn(
                                "resize-none bg-gray-50 border-gray-200 focus:bg-white transition-colors",
                                errors.description && "border-red-300 focus:border-red-500"
                            )}
                            disabled={isCreating}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-600">{errors.description}</p>
                        )}
                    </div>

                    {/* Category and Priority Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-sm font-medium">
                                Catégorie (optionnel)
                            </Label>
                            <Select 
                                value={category} 
                                onValueChange={(value) => setCategory(value as TicketCategory | "")}
                                disabled={isCreating}
                            >
                                <SelectTrigger className="bg-gray-50 border-gray-200">
                                    <SelectValue placeholder="Choisir une catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="UI">Interface</SelectItem>
                                    <SelectItem value="Perf">Performance</SelectItem>
                                    <SelectItem value="Data">Données</SelectItem>
                                    <SelectItem value="Access">Accès</SelectItem>
                                    <SelectItem value="Other">Autre</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Priority */}
                        <div className="space-y-2">
                            <Label htmlFor="priority" className="text-sm font-medium">
                                Priorité
                            </Label>
                            <Select 
                                value={priority} 
                                onValueChange={(value) => setPriority(value as TicketPriority)}
                                disabled={isCreating}
                            >
                                <SelectTrigger className="bg-gray-50 border-gray-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="P3">Faible</SelectItem>
                                    <SelectItem value="P2">Normale</SelectItem>
                                    <SelectItem value="P1">Élevée</SelectItem>
                                    <SelectItem value="P0">Critique</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Severity */}
                    <div className="space-y-2">
                        <Label htmlFor="severity" className="text-sm font-medium">
                            Impact sur votre utilisation (optionnel)
                        </Label>
                        <Select 
                            value={severity} 
                            onValueChange={(value) => setSeverity(value as TicketSeverity | "")}
                            disabled={isCreating}
                        >
                            <SelectTrigger className="bg-gray-50 border-gray-200">
                                <SelectValue placeholder="Sélectionnez l'impact" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">
                                    Faible - Je peux continuer à travailler
                                </SelectItem>
                                <SelectItem value="medium">
                                    Modéré - Cela ralentit mon travail
                                </SelectItem>
                                <SelectItem value="high">
                                    Élevé - Je ne peux pas utiliser cette fonctionnalité
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* User Info */}
                    {user && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm text-blue-900">
                                <span className="font-medium">Ticket créé par:</span> {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-blue-700 mt-1">
                                Vous recevrez une notification par email une fois le ticket traité.
                            </p>
                        </div>
                    )}
                </form>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isCreating}
                        className="border-gray-200"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isCreating}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                        {isCreating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                Création...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Créer le ticket
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};