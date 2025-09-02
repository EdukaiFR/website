/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { ConditionalErrorLayout } from "@/components/errors";
import Link from "next/link";

// Metadata pour le SEO
export const metadata = {
  title: '404 - Page non trouvée | Edukai',
  description: 'La page demandée est introuvable.',
};

export default function NotFound() {
  return (
    <ConditionalErrorLayout bgGradient="from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div role="alert" aria-live="polite">
        {/* Message d'erreur */}
        <h1 
          className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4"
          aria-label="Erreur 404 - Page non trouvée"
        >
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Oups ! Il semble que vous soyez perdu...
        </h2>
        <p 
          className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
          id="notfound-description"
        >
          La page que vous recherchez n'existe pas ou a été supprimée.
        </p>

        {/* Actions possibles */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link 
              href="/" 
              className="flex items-center gap-2"
              aria-describedby="notfound-description"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
              Naviguer vers l'accueil
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/library" className="flex items-center gap-2">
              Voir mes cours
            </Link>
          </Button>
        </div>

        {/* Message d'aide */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Si vous cherchiez quelque chose de spécifique, essayez de naviguer depuis l'accueil.
          </p>
        </div>
      </div>
    </ConditionalErrorLayout>
  );
} 