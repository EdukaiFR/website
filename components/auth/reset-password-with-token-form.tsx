"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, KeyRound, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormErrorAlert } from "@/components/ui/form-alert";
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
      } catch (err) {
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
    } catch (err) {
      setError("Une erreur est survenue lors de la réinitialisation");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while verifying token
  if (isVerifying) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Vérification du lien de réinitialisation...</p>
        </CardContent>
      </Card>
    );
  }

  // Invalid token state
  if (!isTokenValid) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <CardTitle>Lien invalide ou expiré</CardTitle>
          <CardDescription className="text-base">
            {error || "Le lien de réinitialisation est invalide ou a expiré."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Les liens de réinitialisation expirent après 30 minutes pour des raisons de sécurité.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/auth">
              Retour à la connexion
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/auth?mode=forgot">
              Demander un nouveau lien
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <CardTitle>Mot de passe réinitialisé !</CardTitle>
          <CardDescription className="text-base">
            Votre mot de passe a été modifié avec succès.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Vous allez être redirigé vers la page de connexion...
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/auth">
              Se connecter maintenant
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Reset form
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <KeyRound className="h-10 w-10 text-primary mx-auto mb-2" />
        <CardTitle>Créer un nouveau mot de passe</CardTitle>
        <CardDescription>
          {maskedEmail && (
            <span className="block mt-2">
              Réinitialisation pour : <strong>{maskedEmail}</strong>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && <FormErrorAlert message={error} />}

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <div className="relative">
              <Input
                {...register("newPassword")}
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                disabled={isLoading}
                className={errors.newPassword ? "border-destructive" : ""}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-destructive">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Password Requirements */}
          {newPassword && (
            <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Exigences du mot de passe :</p>
              <div className="space-y-1">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {req.met ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={req.met ? "text-green-600" : "text-muted-foreground"}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <div className="relative">
              <Input
                {...register("confirmPassword")}
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                disabled={isLoading}
                className={errors.confirmPassword ? "border-destructive" : ""}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Réinitialisation...
              </>
            ) : (
              "Réinitialiser le mot de passe"
            )}
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/auth">
              Annuler et retourner à la connexion
            </Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}