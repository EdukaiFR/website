"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

  const handleLogin = () => {
    // Mettre à jour l'état de connexion dans localStorage
    localStorage.setItem("isLogin", "true");

    // Émettre un événement personnalisé 'loginStatusChanged' pour informer Header
    window.dispatchEvent(new CustomEvent("loginStatusChanged"));

    // Rediriger vers la page d'accueil une fois connecté
    router.push("/home");
  };

  return (
    <div className="w-full flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Se connecter</h1>
        <Button
          className="w-full rounded-full outfit-regular text-lg text-white bg-primary-500 py-3"
          onClick={handleLogin}
        >
          Connexion
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
