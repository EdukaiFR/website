/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";
import ConditionalErrorLayout from "./ConditionalErrorLayout";

interface GenericErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GenericErrorPage({
    error,
    reset,
}: GenericErrorPageProps) {
    return (
        <ConditionalErrorLayout>
            <div role="alert" aria-live="assertive">
                {/* Message d'erreur générique */}
                <h1
                    className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4"
                    aria-label="Une erreur s'est produite"
                >
                    Oups !
                </h1>
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Une erreur s'est produite
                </h2>
                <p
                    className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
                    id="generic-error-description"
                >
                    Désolé, quelque chose s'est mal passé. Notre équipe a été
                    notifiée du problème.
                </p>

                {/* Actions possibles */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                    <Button
                        onClick={reset}
                        variant="outline"
                        size="lg"
                        aria-describedby="generic-error-description"
                    >
                        Réessayer
                    </Button>
                    <Button
                        asChild
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Link href="/" className="flex items-center gap-2">
                            <Home className="w-4 h-4" aria-hidden="true" />
                            Retour à l'accueil
                        </Link>
                    </Button>
                </div>

                {/* Message d'aide */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        Si le problème persiste, contactez notre support
                        technique.
                    </p>
                </div>

                {/* Info technique pour le développement (masqué en production) */}
                {process.env.NODE_ENV === "development" && (
                    <details className="mt-4 text-left">
                        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                            Détails techniques (dev uniquement)
                        </summary>
                        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
                            <p>
                                <strong>Message:</strong> {error.message}
                            </p>
                            {error.digest && (
                                <p>
                                    <strong>Digest:</strong> {error.digest}
                                </p>
                            )}
                        </div>
                    </details>
                )}
            </div>
        </ConditionalErrorLayout>
    );
}
