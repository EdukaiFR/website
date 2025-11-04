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
        } catch {
            toast.error("Une erreur est survenue");
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
        } catch {
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
                <DialogContent className="sm:max-w-[480px] lg:max-w-[520px] p-0 border-0 bg-transparent shadow-none">
                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
                        <DialogHeader className="text-center mb-8">
                            <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl w-fit">
                                <Share2 className="w-6 h-6 text-white" />
                            </div>
                            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Partager le cours
                            </DialogTitle>
                            <DialogDescription className="text-gray-600 mt-2 text-sm leading-relaxed">
                                {isShared
                                    ? "Ce cours est actuellement partagé via le lien ci-dessous."
                                    : "Créez un lien de partage pour ce cours."}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-5">
                            {isShared ? (
                                <>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            value={shareUrl}
                                            readOnly
                                            className="flex-1 h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl"
                                        />
                                        <Button
                                            onClick={handleCopyLink}
                                            variant="outline"
                                            className="shrink-0 h-12 px-4 border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 rounded-xl"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="w-4 h-4 mr-2 text-green-600" />
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

                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
                                        <p className="text-sm text-blue-900 leading-relaxed">
                                            <strong className="font-semibold">ℹ️ Note :</strong> Toute
                                            personne ayant ce lien pourra consulter
                                            ce cours avec toutes ses fiches de révision, quizzes et examens.
                                        </p>
                                    </div>

                                    <Button
                                        variant="destructive"
                                        onClick={handleToggleShare}
                                        disabled={isLoading}
                                        className="w-full h-12 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        {isLoading
                                            ? "Révocation en cours..."
                                            : "Révoquer le lien de partage"}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-2xl p-5">
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            Un lien unique sera généré pour partager
                                            ce cours avec d&apos;autres personnes. Ils pourront
                                            voir le contenu et l&apos;ajouter à leur bibliothèque.
                                        </p>
                                    </div>

                                    <Button
                                        onClick={handleToggleShare}
                                        disabled={isLoading}
                                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        <Link className="w-4 h-4 mr-2" />
                                        {isLoading
                                            ? "Génération..."
                                            : "Générer un lien de partage"}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
