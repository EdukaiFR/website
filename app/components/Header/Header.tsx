"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
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
  const [selectedLink, setSelectedLink] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [underlinePosition, setUnderlinePosition] = useState<number>(0);
  const [underlineWidth, setUnderlineWidth] = useState<number>(0);
  const linkRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const linksContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSelectedLink(window.location.pathname);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
    <div className="relative flex items-center justify-between w-full py-[2%] lg:px-4">
      <h2
        className="text-lg lg:text-xl text-primary-500 outfit-bold cursor-pointer"
        onClick={navigateToHome}
      >
        Edukai
      </h2>
      <div
        ref={linksContainerRef}
        className="hidden lg:flex lg:absolute left-1/2 transform -translate-x-1/2"
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
        className="hidden lg:flex rounded-full outfit-regular text-sm text-white px-[2.5%] py-[1%] ml-auto"
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

      {/* Mobile View */}
      <div className="flex grow items-center justify-end lg:hidden">
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-white
            hover:text-primary-500 focus:outline-none focus:ring-inset focus:ring-indigo-500"
          onClick={toggleMenu}
        >
          <span className="sr-only">Ouvrir le menu</span>
          {isMenuOpen ? (
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transform transition-all lg:hidden ${
            isMenuOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
          style={{
            transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
          }}
        >
          <div className="px-[5%] w-full h-full py-[2%] bg-black bg-opacity-25 rounded-lg backdrop-blur-lg shadow-lg ring-1 ring-black ring-opacity-5 divide-y-2 divide-gray-50">
            <div className="px-[5%] pb-6 h-full">
              <div className="flex items-center justify-between">
                <h1 className="text-xl text-white outfit-bold">Edukai</h1>
                <div className="">
                  <button
                    className="inline-flex items-center justify-center rounded-md p-2 text-white
            hover:text-primary-500 focus:outline-none focus:ring-inset focus:ring-indigo-500"
                    onClick={toggleMenu}
                  >
                    <span className="sr-only">Fermer</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <hr className="mt-4 border border-gray-500 rounded-full border-opacity-50" />
              <div className="mt-6 h-full flex flex-col">
                <nav className="flex flex-col gap-y-6 items-center justify-center text-white outfit-regular text-md">
                  {Object.entries(linksToShow).map(([name, url]) => (
                    <a
                      key={name}
                      href={url}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedLink(url);
                        router.push(url);
                        toggleMenu();
                      }}
                      className={`transition-all relative hover:text-primary-500 ${
                        selectedLink === url ? "text-primary-500" : ""
                      }`}
                    >
                      {name.replace("_", " ")}
                    </a>
                  ))}
                </nav>

                <div className="flex flex-col items-center justify-center gap-5 mt-auto mb-20">
                  <Button
                    className="rounded-full outfit-regular text-sm text-white px-[10%] py-[5%]"
                    onClick={
                      isLogin
                        ? handleLoginToggle
                        : () => {
                            router.push("/auth/login");
                            setSelectedLink("/auth/login");
                            updateUnderline("/auth/login"); // Update underline on login click
                            toggleMenu();
                          }
                    }
                  >
                    {isLogin ? "Se déconnecter" : "Se connecter"}
                  </Button>
                  <Badge className="flex items-center justify-center gap-2 outfit-regular text-xs text-primary-500 px-3 py-1 rounded-full border border-primary-500 bg-primary-500 bg-opacity-25 hover:bg-primary-500 hover:bg-opacity-25 whitespace-nowrap">
                    <Image
                      src={"/icons/stars.svg"}
                      width={15}
                      height={15}
                      alt="Stars"
                    />
                    Dès Juillet 2025
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
