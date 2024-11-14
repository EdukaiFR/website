"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
  const pathname = usePathname();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [linksToShow, setLinksToShow] =
    useState<Record<string, string>>(guestLinks);
  const [selectedLink, setSelectedLink] = useState<string>(
    window.location.pathname
  );
  const [underlinePosition, setUnderlinePosition] = useState<number>(0);
  const [underlineWidth, setUnderlineWidth] = useState<number>(0);
  const linkRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const linksContainerRef = useRef<HTMLDivElement | null>(null);

  // Function to update the underline position and width based on the selected link
  const updateUnderline = (url: string) => {
    const selectedRef = linkRefs.current[url];
    if (selectedRef && linksContainerRef.current) {
      const containerRect = linksContainerRef.current.getBoundingClientRect();
      const selectedRect = selectedRef.getBoundingClientRect();
      setUnderlinePosition(selectedRect.left - containerRect.left);
      setUnderlineWidth(selectedRect.width);
    }
  };

  // Function to load the login status from localStorage
  const updateLoginStatus = () => {
    const storedLoginStatus = localStorage.getItem("isLogin");
    const loginStatus = storedLoginStatus === "true";
    setIsLogin(loginStatus);
    setLinksToShow(loginStatus ? loginLinks : guestLinks);
    setSelectedLink(loginStatus ? loginLinks.Accueil : guestLinks.Solution);
    updateUnderline(selectedLink); // Update underline on load
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
    updateUnderline(newLink); // Update underline on toggle
    router.push(newLink);
  };

  const navigateToHome = () => {
    if (isLogin) {
      router.push(loginLinks.Accueil);
      setSelectedLink(loginLinks.Accueil);
      updateUnderline(loginLinks.Accueil); // Update underline on home click
      return;
    }
    router.push(guestLinks.Solution);
    setSelectedLink(guestLinks.Solution);
    updateUnderline(guestLinks.Solution); // Update underline on home click
  };

  useEffect(() => {
    updateUnderline(selectedLink); // Initial position of the underline

    // Listen for window resize to adjust underline position
    const handleResize = () => updateUnderline(selectedLink);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedLink]);

  useEffect(() => {
    console.log("Actual pathname:", pathname);
    updateUnderline(pathname); // Update underline position when pathname changes
  }, [pathname]);

  return (
    <div className="relative flex items-center justify-between w-full py-[2%] px-4">
      <h2
        className="text-xl text-primary-500 outfit-bold cursor-pointer"
        onClick={navigateToHome}
      >
        Edukai
      </h2>
      <div
        ref={linksContainerRef}
        className="absolute left-1/2 transform -translate-x-1/2"
      >
        <div className="relative flex items-center gap-5">
          {Object.entries(linksToShow).map(([name, url]) => (
            <a
              key={name}
              href={url}
              ref={(el) => {
                linkRefs.current[url] = el;
              }}
              onClick={(e) => {
                e.preventDefault();
                setSelectedLink(url);
                updateUnderline(url);
                router.push(url);
              }}
              className={`relative text-md text-white hover:text-primary-500 outfit-regular ${
                selectedLink === url ? "text-primary-500" : ""
              }`}
            >
              {name.replace("_", " ")}
            </a>
          ))}
          {/* Underline element */}
          <span
            className="absolute bottom-[-4px] h-[2.5px] bg-primary-500 rounded-full transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(${underlinePosition}px)`,
              width: `${underlineWidth * 0.75}px`,
            }}
          ></span>
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
                updateUnderline("/auth/login"); // Update underline on login click
              }
        }
      >
        {isLogin ? "Se déconnecter" : "Se connecter"}
      </Button>
    </div>
  );
};
