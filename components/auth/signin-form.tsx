"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { FormErrorAlert } from "@/components/ui/form-alert";
import { signinSchema, type SigninFormValues } from "@/lib/schemas/auth";
import { useSession } from "@/hooks/useSession";

export interface SigninFormProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
    onForgotPassword?: () => void;
}

export function SigninForm({
    onSuccess,
    onError,
    onForgotPassword,
}: SigninFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useSession();

    const form = useForm<SigninFormValues>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit = async (data: SigninFormValues) => {
        setIsLoading(true);

        try {
            // Map form data to API format
            const credentials = {
                username: data.email, // API expects username, form uses email
                password: data.password,
            };

            const result = await login(credentials);

            if (result.success) {
                onSuccess?.();
            } else {
                const errorMessage = result.error || "Une erreur est survenue";
                form.setError("root", { message: errorMessage });
                onError?.(errorMessage);
            }
        } catch (error) {
            console.error(error);
            const errorMessage = "Une erreur inattendue est survenue";
            form.setError("root", { message: errorMessage });
            onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="text-center space-y-2 sm:space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                    Content de te revoir !
                </h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Connecte-toi pour continuer à réviser et progresser
                </p>
            </div>

            {/* Form */}
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 sm:space-y-5"
                >
                    {/* Email Field */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Adresse email
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type="email"
                                            placeholder="ton.email@exemple.com"
                                            className="pl-11 h-12 sm:h-13 border-2 rounded-xl transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base border-gray-200 bg-gray-50/50 focus:bg-white"
                                            {...field}
                                        />
                                        <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-sm text-red-500" />
                            </FormItem>
                        )}
                    />

                    {/* Password Field */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    Mot de passe
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="••••••••"
                                            className="pl-11 pr-12 h-12 sm:h-13 border-2 rounded-xl transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-base border-gray-200 bg-gray-50/50 focus:bg-white"
                                            {...field}
                                        />
                                        <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-lg hover:bg-blue-50"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-sm text-red-500" />
                            </FormItem>
                        )}
                    />

                    {/* Remember me & Forgot password */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                        <FormField
                            control={form.control}
                            name="rememberMe"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-3">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="border-2 border-gray-300"
                                        />
                                    </FormControl>
                                    <FormLabel className="text-sm text-gray-700 font-medium cursor-pointer">
                                        Se souvenir de moi
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                        <Button
                            type="button"
                            variant="link"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium p-0 h-auto self-start sm:self-auto"
                            onClick={onForgotPassword}
                        >
                            Mot de passe oublié ?
                        </Button>
                    </div>

                    {/* Error Display */}
                    {form.formState.errors.root && (
                        <FormErrorAlert
                            message={
                                form.formState.errors.root.message ||
                                "Une erreur est survenue"
                            }
                        />
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Connexion en cours...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Se connecter
                                <ArrowRight className="w-4 h-4" />
                            </span>
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
