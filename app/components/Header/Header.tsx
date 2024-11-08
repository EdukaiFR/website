"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const loginLinks = {
  Accueil: "/",
  Générateur: "/generator",
  Club_Edukai: "/clubEdukai",
  Mes_Cours: "/myCourses",
  Mon_Profil: "/myProfile",
};

const guestLinks = {
  Solution: "/",
  Prix: "/pricing",
  Partenaires: "/partner",
  Blog: "/blog",
  Support: "/support",
};

export const Header = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [linksToShow, setLinksToShow] =
    useState<Record<string, string>>(guestLinks);

  // Initialize selectedLink with an empty string
  const [selectedLink, setSelectedLink] = useState<string>("");

  // Use useEffect to safely access window object after the component mounts
  useEffect(() => {
    setSelectedLink(window.location.pathname);
  }, []);

  useEffect(() => {
    if (isLogin) {
      setLinksToShow(loginLinks);
    } else {
      setLinksToShow(guestLinks);
    }
  }, [isLogin]);

  return (
    <div className="relative flex items-center justify-between w-full py-[2%] px-4">
      {/* Left-aligned title */}
      <h2 className="text-xl text-primary-500 outfit-bold">Edukai</h2>

      {/* Center-aligned menu */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-5">
          {Object.entries(linksToShow).map(([name, url]) => (
            <a
              key={name}
              href={url}
              onClick={() => setSelectedLink(url)}
              className={`relative transition-all text-md text-white hover:text-primary-500 outfit-regular
                ${
                  selectedLink === url
                    ? "after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-[-4px] after:w-[75%] after:h-[2px] after:bg-primary-500 after:rounded-full"
                    : ""
                } `}
            >
              {name.replace("_", " ")}
            </a>
          ))}
        </div>
      </div>

      {/* Right-aligned button */}
      <Button className="rounded-full outfit-regular text-sm text-white px-[2.5%] py-[1%] ml-auto">
        Se connecter
      </Button>
    </div>
  );
};
