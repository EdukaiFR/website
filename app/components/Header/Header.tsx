"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const loginLinks = {
  Accueil: "/home",
  Générateur: "/generator",
  Club_Edukai: "/clubEdukai",
  Mes_Cours: "/myCourses",
};

const guestLinks = {
  Solution: "/",
  Prix: "/pricing",
  Partenaires: "/partner",
  Blog: "/blog",
  Support: "/support",
};

export const Header = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [linksToShow, setLinksToShow] =
    useState<Record<string, string>>(guestLinks);
  const [selectedLink, setSelectedLink] = useState<string>("");

  // Charger l'état de connexion depuis localStorage au montage du composant
  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLogin");
    if (storedLoginStatus) {
      const parsedLoginStatus = JSON.parse(storedLoginStatus);
      setIsLogin(parsedLoginStatus);
      setLinksToShow(parsedLoginStatus ? loginLinks : guestLinks);
      setSelectedLink(
        parsedLoginStatus ? loginLinks.Accueil : guestLinks.Solution
      );
    }
  }, []);

  // Mettre à jour localStorage et les liens affichés seulement quand isLogin change
  const handleLoginToggle = () => {
    const newLoginStatus = !isLogin;
    setIsLogin(newLoginStatus);
    localStorage.setItem("isLogin", JSON.stringify(newLoginStatus));
    setLinksToShow(newLoginStatus ? loginLinks : guestLinks);
    setSelectedLink(newLoginStatus ? loginLinks.Accueil : guestLinks.Solution);
    if (newLoginStatus) {
      router.push(loginLinks.Accueil);
    } else if (!newLoginStatus) {
      router.push(guestLinks.Solution);
    }
  };

  return (
    <div className="relative flex items-center justify-between w-full py-[2%] px-4">
      <h2 className="text-xl text-primary-500 outfit-bold">Edukai</h2>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-5">
          {Object.entries(linksToShow).map(([name, url]) => (
            <a
              key={name}
              href={url}
              onClick={(e) => {
                e.preventDefault(); // Empêcher le rechargement
                setSelectedLink(url);
                router.push(url);
              }}
              className={`relative transition-all text-md text-white hover:text-primary-500 outfit-regular ${
                selectedLink === url
                  ? "after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-[-4px] after:w-[75%] after:h-[2px] after:bg-primary-500 after:rounded-full"
                  : ""
              }`}
            >
              {name.replace("_", " ")}
            </a>
          ))}
        </div>
      </div>
      <Button
        className="rounded-full outfit-regular text-sm text-white px-[2.5%] py-[1%] ml-auto"
        onClick={handleLoginToggle}
      >
        {isLogin ? "Se déconnecter" : "Se connecter"}
      </Button>
    </div>
  );
};
