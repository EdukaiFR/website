// "use client";

// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";

// export default function NotFound() {
//   const router = useRouter();

//   return (
//     <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
//       <h1 className="text-7xl font-bold text-primary-500">404</h1>
//       <p className="text-lg text-muted-foreground">
//         La page que tu cherches n'existe pas ou a été déplacée.
//       </p>
//       <Button onClick={() => router.push("/")} className="mt-4">
//         Retour à l'accueil
//       </Button>
//     </div>
//   );
// }


"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-satoshi">
      <div className="flex flex-col items-center justify-center gap-6">
        {/* Logo avec rotation subtile */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <img
            src="/EdukaiLogo.svg"
            alt="Edukai Logo"
            className="w-[100px] h-[100px]"
          />
        </motion.div>

        {/* Message d'erreur 404 */}
        <h1 className="text-7xl font-bold text-primary-500">404</h1>
        <p className="text-lg text-muted-foreground">
          Cette page est introuvable.
        </p>

        {/* Bouton retour accueil */}
        <Button onClick={() => router.push("/home")} className="mt-4">
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
}

