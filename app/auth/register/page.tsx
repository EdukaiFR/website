"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const RegisterPage = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isInputFilled, setIsInputFilled] = useState(false);

  const handleLogin = () => {
    // Update the login status in localStorage
    localStorage.setItem("isLogin", "true");

    // Emit a custom 'loginStatusChanged' event to inform Header
    window.dispatchEvent(new CustomEvent("loginStatusChanged"));

    // Redirect to the home page once logged in
    router.push("/home");
  };

  // Check if the login fields are filled
  useEffect(() => {
    setIsInputFilled(
      email !== "" && password !== "" && firstName !== "" && name !== ""
    );
  }, [email, password, firstName, name]);

  return (
    <div className="w-full h-full mt-auto mb-auto flex items-center justify-center">
      <div className="bg-primary-500 bg-opacity-5 border-2 border-white border-opacity-15 p-8 rounded-lg shadow-lg max-w-md w-full flex flex-col gap-3 items-start">
        {/* Header */}
        <div className="flex flex-col gap-1 items-start">
          <h1 className="text-2xl outfit-regular text-white">
            Bienvenue sur Edukai !
          </h1>
          <p className="text-xs outfit-light text-white text-opacity-75">
            Remplis les champs ci-dessous pour t'inscrire.
          </p>
        </div>

        {/* Google Auth */}
        <div className="w-full flex items-center justify-start">
          <Button
            onClick={() => toast.warning("Feature not yet available.")}
            variant={"outline"}
            className="w-full rounded-full outfit-regular text-md text-black bg-white py-3 hover:border-none hover:bg-white hover:bg-opacity-75 transition-all"
          >
            <Image
              src={"/icons/google.svg"}
              width={20}
              height={20}
              alt="Google Logo"
            />
            S'inscrire avec Google
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center w-full">
          <hr className="flex-grow border-t border-gray-300 border-opacity-50" />
          <span className="mx-2 text-gray-400">ou</span>
          <hr className="flex-grow border-t border-gray-300 border-opacity-50" />
        </div>

        {/* Sign in Form */}
        <div className="w-full flex flex-col items-start gap-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label className="text-white outfit-light" htmlFor="firstname">
              Prénom
            </Label>
            <Input
              className="rounded-full px-[5%] py-[2.5%] outfit-regular text-white text-lg"
              type="text"
              id="firstname"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label className="text-white outfit-light" htmlFor="firstname">
              Nom
            </Label>
            <Input
              className="rounded-full px-[5%] py-[2.5%] outfit-regular text-white text-lg"
              type="text"
              id="name"
              placeholder="Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label className="text-white outfit-light" htmlFor="email">
              Mail
            </Label>
            <Input
              className="rounded-full px-[5%] py-[2.5%] outfit-regular text-white text-lg"
              type="email"
              id="email"
              placeholder="john.doe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label className="text-white outfit-light" htmlFor="password">
              Mot de passe
            </Label>
            <Input
              className="rounded-full px-[5%] py-[2.5%] outfit-regular text-white text-lg"
              type="password"
              id="password"
              placeholder="simple_password.123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Confirm CTA */}
        <Button
          className="w-full rounded-full outfit-regular text-lg text-white bg-primary-500 py-3 mt-5"
          onClick={handleLogin}
          disabled={!isInputFilled}
        >
          S'inscire
        </Button>

        {/* Footer */}
        <div className="flex items-center justify-center w-full">
          <p className="text-xs outfit-light text-white text-opacity-75">
            Tu as déjà un compte ?{" "}
            <span
              className="transition-all text-primary-500 cursor-pointer hover:underline"
              onClick={() => router.push("/auth/login")}
            >
              Connecte-toi
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
