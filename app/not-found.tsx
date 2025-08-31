import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
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

        {/* Message d'erreur */}
        <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Oups ! Il semble que vous soyez perdu...
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          La page que vous recherchez n'existe pas ou a été supprimée.
        </p>

        {/* Bouton d'action */}
        <div className="flex justify-center">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Naviguer vers l'accueil
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 