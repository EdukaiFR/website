/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import { Home, LogIn } from "lucide-react";
import Link from "next/link";
import ConditionalErrorLayout from "./ConditionalErrorLayout";

interface UnauthorizedErrorPageProps {
  reset: () => void;
}

export default function UnauthorizedErrorPage({ reset }: UnauthorizedErrorPageProps) {
  return (
    <ConditionalErrorLayout bgGradient="from-orange-50 to-yellow-100 dark:from-gray-900 dark:to-orange-900/20">
      <div role="alert" aria-live="assertive">
        {/* Icône d'erreur */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
            <LogIn className="w-8 h-8 text-orange-600 dark:text-orange-400" aria-hidden="true" />
          </div>
        </div>

        {/* Message d'erreur */}
        <h1 
          className="text-6xl font-bold text-orange-600 dark:text-orange-400 mb-4"
          aria-label="Erreur 401 - Non autorisé"
        >
          401
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Authentification requise
        </h2>
        <p 
          className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
          id="auth-error-description"
        >
          Vous devez être connecté pour accéder à cette page. Votre session a peut-être expiré.
        </p>

        {/* Actions possibles */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Button 
            onClick={reset} 
            variant="outline" 
            size="lg"
            className="border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/20"
            aria-describedby="auth-error-description"
          >
            Réessayer
          </Button>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/auth" className="flex items-center gap-2">
              <LogIn className="w-4 h-4" aria-hidden="true" />
              Se connecter
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" aria-hidden="true" />
              Accueil
            </Link>
          </Button>
        </div>

        {/* Message d'aide */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Si vous avez déjà un compte, essayez de vous reconnecter. Sinon, créez un compte gratuit.
          </p>
        </div>
      </div>
    </ConditionalErrorLayout>
  );
}