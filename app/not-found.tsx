// app/not-found.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
      <h1 className="text-7xl font-bold text-primary-500">404</h1>
      <p className="text-lg text-muted-foreground">
        La page que tu cherches n'existe pas ou a été déplacée.
      </p>
      <Button onClick={() => router.push("/home")} className="mt-4">
        Retour à l'accueil
      </Button>
    </div>
  );
}
