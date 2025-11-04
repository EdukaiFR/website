"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, CheckCircle, XCircle, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyResetTokenAction, resetPasswordWithTokenAction } from "@/lib/actions/auth";
import { getPasswordRequirements } from "@/lib/schemas/auth";
import { showToast } from "@/lib/toast";
import Link from "next/link";

// Schema for password reset with token
const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
    ),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordWithTokenForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const newPassword = watch("newPassword", "");
  const passwordRequirements = getPasswordRequirements(newPassword);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError("Aucun token de réinitialisation fourni");
        setIsVerifying(false);
        return;
      }

      try {
        const response = await verifyResetTokenAction(token);

        if (response.success) {
          setIsTokenValid(true);
          setMaskedEmail(response.maskedEmail || "");
        } else {
          setError(response.error || "Token invalide ou expiré");
        }
      } catch {
        setError("Une erreur est survenue lors de la vérification du token");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      setError("Token manquant");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await resetPasswordWithTokenAction(token, data.newPassword);

      if (response.success) {
        setIsSuccess(true);
        showToast.success("Mot de passe réinitialisé avec succès !");

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/auth");
        }, 3000);
      } else {
        setError(response.error || "Une erreur est survenue");
      }
    } catch {
      setError("Une erreur est survenue lors de la réinitialisation");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while verifying token
  if (isVerifying) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-600">Vérification du lien de réinitialisation...</p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!isTokenValid) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Error Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Lien invalide ou expiré
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
            {error || "Le lien de réinitialisation est invalide ou a expiré."}
          </p>
          <p className="text-sm text-gray-500">
            Les liens de réinitialisation expirent après 30 minutes pour des raisons de sécurité.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/auth">
            <Button className="w-full h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-base">
              Retour à la connexion
            </Button>
          </Link>
          <Link href="/auth?mode=forgot">
            <Button
              variant="outline"
              className="w-full h-11 sm:h-12 border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-base"
            >
              Demander un nouveau lien
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Mot de passe réinitialisé !
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
            Votre mot de passe a été modifié avec succès.
          </p>
          <p className="text-sm text-gray-500">
            Vous allez être redirigé vers la page de connexion...
          </p>
        </div>

        {/* Action */}
        <Link href="/auth">
          <Button className="w-full h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-base">
            Se connecter maintenant
          </Button>
        </Link>
      </div>
    );
  }

  // Reset form
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center space-y-1 sm:space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Créer un nouveau mot de passe
        </h2>
        {maskedEmail && (
          <p className="text-sm sm:text-base text-gray-600">
            Réinitialisation pour : <strong>{maskedEmail}</strong>
          </p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 flex items-center gap-2">
              <span className="text-red-500">⚠</span>
              {error}
            </p>
          </div>
        )}

        {/* New Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="newPassword"
            className="text-sm font-medium text-gray-700 flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Nouveau mot de passe
          </label>
          <div className="relative">
            <Input
              {...register("newPassword")}
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={isLoading}
              className={`pr-10 h-11 sm:h-12 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base ${
                errors.newPassword
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-200"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <span className="w-4 h-4 text-xs">⚠</span>
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Password Requirements */}
        {newPassword && (
          <div className="p-3 sm:p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Exigences du mot de passe :
            </p>
            <div className="grid gap-1.5">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {req.met ? (
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  )}
                  <span className={req.met ? "text-green-700" : "text-gray-600"}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirm Password Field */}
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
              {...register("confirmPassword")}
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={isLoading}
              className={`pr-10 h-11 sm:h-12 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base ${
                errors.confirmPassword
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-200"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Réinitialisation...
            </span>
          ) : (
            "Réinitialiser le mot de passe"
          )}
        </Button>

        {/* Cancel Button */}
        <Link href="/auth">
          <Button
            type="button"
            variant="ghost"
            className="w-full h-11 sm:h-12 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200 text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Annuler et retourner à la connexion
          </Button>
        </Link>
      </form>
    </div>
  );
}