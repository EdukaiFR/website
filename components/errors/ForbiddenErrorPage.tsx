/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import { Home, Shield } from "lucide-react";
import Link from "next/link";
import ConditionalErrorLayout from "./ConditionalErrorLayout";

interface ForbiddenErrorPageProps {
  reset: () => void;
}

export default function ForbiddenErrorPage({ reset }: ForbiddenErrorPageProps) {
  return (
    <ConditionalErrorLayout bgGradient="from-red-50 to-orange-100 dark:from-gray-900 dark:to-red-900/20">
      <div role="alert" aria-live="assertive">
        {/* Icône d'erreur */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-red-600 dark:text-red-400" aria-hidden="true" />
          </div>
        </div>

        {/* Message d'erreur */}
        <h1 
          className="text-6xl font-bold text-red-600 dark:text-red-400 mb-4"
          aria-label="Erreur 403 - Accès interdit"
        >
          403
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Accès interdit
        </h2>
        <p 
          className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
          id="error-description"
        >
          Désolé, vous n'avez pas les permissions nécessaires pour accéder à cette ressource.
        </p>

        {/* Actions possibles */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Button 
            onClick={reset} 
            variant="outline" 
            size="lg"
            className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            aria-describedby="error-description"
          >
            Réessayer
          </Button>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" aria-hidden="true" />
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
    </ConditionalErrorLayout>
  );
}