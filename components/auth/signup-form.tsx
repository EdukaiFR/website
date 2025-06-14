"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormErrorAlert } from "@/components/ui/form-alert";
import {
  signupSchema,
  type SignupFormValues,
  getPasswordRequirements,
} from "@/lib/schemas/auth";
import { useSession } from "@/hooks/useSession";

export interface SignupFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function SignupForm({ onSuccess, onError }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useSession();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch("password");
  const passwordRequirements = getPasswordRequirements(password || "");

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);

    try {
      // Map form data to API format
      const userData = {
        username: data.email, // API expects username, form uses email
        password: data.password,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      };

      const result = await registerUser(userData);

      if (result.success) {
        onSuccess?.();
      } else {
        const errorMessage = result.error || "Une erreur est survenue";
        setError("root", { message: errorMessage });
        onError?.(errorMessage);
      }
    } catch (error) {
      const errorMessage = "Une erreur inattendue est survenue";
      setError("root", { message: errorMessage });
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center space-y-1 sm:space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Créer ton compte
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Rejoins Edukai et révolutionne tes révisions
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-5"
      >
        {/* First Name & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Prénom
            </label>
            <div className="relative">
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                {...register("firstName")}
                className={`pl-10 h-11 sm:h-12 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base ${
                  errors.firstName
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-200"
                }`}
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {errors.firstName && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="w-4 h-4 text-xs">⚠</span>
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Nom
            </label>
            <div className="relative">
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                {...register("lastName")}
                className={`pl-10 h-11 sm:h-12 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base ${
                  errors.lastName
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-200"
                }`}
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {errors.lastName && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="w-4 h-4 text-xs">⚠</span>
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-gray-700 flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Adresse email
          </label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="john.doe@exemple.com"
              {...register("email")}
              className={`pl-10 h-11 sm:h-12 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base ${
                errors.email
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-200"
              }`}
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <span className="w-4 h-4 text-xs">⚠</span>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700 flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Mot de passe
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={`pl-10 pr-12 h-11 sm:h-12 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base ${
                errors.password
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-200"
              }`}
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Password Requirements */}
          {password && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-2">
                Critères du mot de passe :
              </p>
              <div className="grid grid-cols-2 gap-2">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full flex items-center justify-center ${
                        req.met ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      {req.met && <Check className="w-2 h-2 text-white" />}
                    </div>
                    <span
                      className={`text-xs ${
                        req.met ? "text-green-700" : "text-gray-600"
                      }`}
                    >
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {errors.password && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <span className="w-4 h-4 text-xs">⚠</span>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-gray-700 flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={`pl-10 pr-12 h-11 sm:h-12 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base ${
                errors.confirmPassword
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-200"
              }`}
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <span className="w-4 h-4 text-xs">⚠</span>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Error Display */}
        {errors.root && (
          <FormErrorAlert
            message={errors.root.message || "Une erreur est survenue"}
          />
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Création en cours...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Créer mon compte
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}
