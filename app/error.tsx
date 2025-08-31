"use client";

import { Button } from "@/components/ui/button";
import { Home, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log l'erreur pour le debugging
    console.error("Erreur de l'application:", error);
  }, [error]);

  // Vérifier si c'est une erreur 403 (Forbidden)
  const isForbidden = error.message.includes("403") || 
                     error.message.includes("Forbidden") ||
                     error.message.includes("Access denied") ||
                     error.message.includes("Accès refusé");

  if (isForbidden) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-red-900/20 p-4">
        <div className="text-center max-w-md mx-auto">
          {/* Logo pingouin avec animation de rotation douce */}
          <div className="mb-8 flex justify-center">
            <div className="animate-rotate-gentle">
              <Image
                src="/EdukaiLogo.svg"
                alt="Edukai Logo"
                width={120}
                height={120}
                className="drop-shadow-lg"
              />
            </div>
          </div>

          {/* Icône d'erreur */}
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* Message d'erreur */}
          <h1 className="text-6xl font-bold text-red-600 dark:text-red-400 mb-4">
            403
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Accès interdit
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            Désolé, vous n'avez pas les permissions nécessaires pour accéder à cette ressource.
          </p>

          {/* Actions possibles */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button 
              onClick={reset} 
              variant="outline" 
              size="lg"
              className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              Réessayer
            </Button>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Retour à l'accueil
              </Link>
            </Button>
          </div>

          {/* Message d'aide */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Si vous pensez qu'il s'agit d'une erreur, contactez votre administrateur ou le support technique.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Erreur générique pour les autres types d'erreurs
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Logo pingouin avec animation de rotation douce */}
        <div className="mb-8 flex justify-center">
          <div className="animate-rotate-gentle">
            <Image
              src="/EdukaiLogo.svg"
              alt="Edukai Logo"
              width={120}
              height={120}
              className="drop-shadow-lg"
            />
          </div>
        </div>

        {/* Message d'erreur générique */}
        <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Oups !
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Une erreur s'est produite
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          Désolé, quelque chose s'est mal passé. Notre équipe a été notifiée du problème.
        </p>

        {/* Actions possibles */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Button 
            onClick={reset} 
            variant="outline" 
            size="lg"
          >
            Réessayer
          </Button>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>

        {/* Message d'aide */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Si le problème persiste, contactez notre support technique.
          </p>
        </div>
      </div>
    </div>
  );
} 