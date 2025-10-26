"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCourseService } from "@/services";
import { Check, Copy, Link, Share2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareCourseDialogProps {
    courseId: string;
    shareToken?: string;
    onShareToggled?: (courseId: string, newShareToken?: string) => void;
}

export const ShareCourseDialog = ({
    courseId,
    shareToken,
    onShareToggled,
}: ShareCourseDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [localShareToken, setLocalShareToken] = useState(shareToken);

    const { toggleShare } = useCourseService();

    const isShared = !!localShareToken;
    const shareUrl = localShareToken
        ? `${window.location.origin}/shared/course/${localShareToken}`
        : "";

    const handleToggleShare = async () => {
        setIsLoading(true);
        try {
            const response = await toggleShare(courseId);

            if (response.status === "success") {
                const newToken = response.item?.shareToken;
                setLocalShareToken(newToken);

                if (onShareToggled) {
                    onShareToggled(courseId, newToken);
                }

                toast.success(
                    newToken
                        ? "Lien de partage créé avec succès !"
                        : "Lien de partage révoqué."
                );

                if (!newToken) {
                    setIsOpen(false);
                }
            } else {
                toast.error(
                    response.message ||
                        "Erreur lors du partage du cours"
                );
            }
        } catch (error) {
            toast.error("Une erreur est survenue");
            console.error("Error toggling share:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyLink = async () => {
        if (!shareUrl) return;

        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success("Lien copié dans le presse-papier !");

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            toast.error("Erreur lors de la copie du lien");
        }
    };

    return (
        <>
            <Button
                size="sm"
                variant={isShared ? "default" : "outline"}
                className={`${
                    isShared
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "border-blue-200 hover:bg-blue-50 text-blue-700"
                }`}
                onClick={() => setIsOpen(true)}
            >
                {isShared ? (
                    <>
                        <Link className="w-4 h-4 mr-2" />
                        Partagé
                    </>
                ) : (
                    <>
                        <Share2 className="w-4 h-4 mr-2" />
                        Partager
                    </>
                )}
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Share2 className="w-5 h-5 text-blue-600" />
                            Partager le cours
                        </DialogTitle>
                        <DialogDescription>
                            {isShared
                                ? "Ce cours est actuellement partagé via le lien ci-dessous."
                                : "Créez un lien de partage pour ce cours."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {isShared ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <Input
                                        value={shareUrl}
                                        readOnly
                                        className="flex-1"
                                    />
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleCopyLink}
                                        className="shrink-0"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4 mr-2" />
                                                Copié !
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4 mr-2" />
                                                Copier
                                            </>
                                        )}
                                    </Button>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-sm text-blue-800">
                                        <strong>ℹ️ Note :</strong> Toute
                                        personne ayant ce lien pourra consulter
                                        ce cours avec toutes ses fiches de révision, quizzes et examens.
                                    </p>
                                </div>

                                <Button
                                    variant="destructive"
                                    onClick={handleToggleShare}
                                    disabled={isLoading}
                                    className="w-full"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    {isLoading
                                        ? "Révocation en cours..."
                                        : "Révoquer le lien de partage"}
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <p className="text-sm text-gray-700">
                                        Un lien unique sera généré pour partager
                                        ce cours avec d'autres personnes. Ils pourront
                                        voir le contenu et l'ajouter à leur bibliothèque.
                                    </p>
                                </div>

                                <Button
                                    onClick={handleToggleShare}
                                    disabled={isLoading}
                                    className="w-full"
                                >
                                    <Link className="w-4 h-4 mr-2" />
                                    {isLoading
                                        ? "Génération..."
                                        : "Générer un lien de partage"}
                                </Button>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
