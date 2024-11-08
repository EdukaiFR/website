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
  const [selectedLink, setSelectedLink] = useState<string>(
    window.location.pathname
  );

  // Function to load the login status from localStorage
  const updateLoginStatus = () => {
    const storedLoginStatus = localStorage.getItem("isLogin");
    const loginStatus = storedLoginStatus === "true";
    setIsLogin(loginStatus);
    setLinksToShow(loginStatus ? loginLinks : guestLinks);
    setSelectedLink(loginStatus ? loginLinks.Accueil : guestLinks.Solution);
  };

  useEffect(() => {
    // Load initial login status
    updateLoginStatus();

    // Listen to the custom 'loginStatusChanged' event for login updates
    const handleLoginStatusChange = () => updateLoginStatus();
    window.addEventListener("loginStatusChanged", handleLoginStatusChange);

    // Cleanup listener when the component unmounts
    return () => {
      window.removeEventListener("loginStatusChanged", handleLoginStatusChange);
    };
  }, []);

  const handleLoginToggle = () => {
    const newLoginStatus = !isLogin;
    setIsLogin(newLoginStatus);
    localStorage.setItem("isLogin", JSON.stringify(newLoginStatus));

    // Trigger the custom event to inform of a login change
    window.dispatchEvent(new CustomEvent("loginStatusChanged"));

    // Redirect and update the selected link
    const newLink = newLoginStatus ? loginLinks.Accueil : guestLinks.Solution;
    setSelectedLink(newLink);
    router.push(newLink);
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
                e.preventDefault(); // Prevent page reload
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
        onClick={
          isLogin
            ? handleLoginToggle
            : () => {
                router.push("/auth/login");
                setSelectedLink("/auth/login");
              }
        }
      >
        {isLogin ? "Se déconnecter" : "Se connecter"}
      </Button>
    </div>
  );
};
