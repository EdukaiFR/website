"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useIsAdmin, useRolePermissions, useSession } from "@/hooks";
import {
    formatLimitValue,
    GroupedLimits,
    LimitName,
    LIMIT_LABELS,
    Plan,
} from "@/lib/types/plan-limits";
import { usePlanLimitsService } from "@/services";
import {
    AlertTriangle,
    Check,
    Loader2,
    RefreshCw,
    Settings,
    Shield,
    X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// Optimized component with memoization
export default function AdminPlanLimitsPage() {
    const router = useRouter();
    const session = useSession();
    const isAdmin = useIsAdmin();
    const permissions = useRolePermissions();
    const planLimitsService = usePlanLimitsService();

    // Ref to prevent infinite loop - tracks if initial fetch happened
    const hasFetchedRef = useRef(false);
    // Ref to store stable service reference
    const serviceRef = useRef(planLimitsService);
    serviceRef.current = planLimitsService;

    // State management
    const [limits, setLimits] = useState<GroupedLimits>({});
    const [isLoading, setIsLoading] = useState(true);
    const [editingLimit, setEditingLimit] = useState<{
        name: LimitName;
        plan: Plan;
        value: string;
    } | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Redirect non-admin users
    useEffect(() => {
        if (!session.loading && (!session.user || !isAdmin)) {
            router.push("/");
            return;
        }
    }, [session.loading, session.user, isAdmin, router]);

    // Load limits - stable function that uses ref
    const loadLimits = useCallback(async (force = false) => {
        // Skip if already fetched and not forced
        if (hasFetchedRef.current && !force) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await serviceRef.current.getGroupedLimits();
            if (response && response.items) {
                setLimits(response.items);
                hasFetchedRef.current = true;
            }
        } catch (error) {
            console.error("Failed to load plan limits:", error);
            toast.error("Erreur lors du chargement des limitations");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load limits on mount - only when conditions are met
    useEffect(() => {
        if (
            !session.loading &&
            session.user &&
            permissions.canAccessAdminEndpoints &&
            isAdmin &&
            !hasFetchedRef.current
        ) {
            loadLimits();
        }
    }, [
        session.loading,
        session.user,
        permissions.canAccessAdminEndpoints,
        isAdmin,
        loadLimits,
    ]);

    // Memoized limit entries
    const limitEntries = useMemo(() => {
        return Object.entries(limits);
    }, [limits]);

    // Handle edit start
    const handleEdit = useCallback(
        (limitName: LimitName, plan: Plan, currentValue: number) => {
            setEditingLimit({
                name: limitName,
                plan,
                value: currentValue === -1 ? "-1" : currentValue.toString(),
            });
        },
        []
    );

    // Handle cancel edit
    const handleCancelEdit = useCallback(() => {
        setEditingLimit(null);
    }, []);

    // Handle save edit
    const handleSave = useCallback(async () => {
        if (!editingLimit) return;

        const newValue = parseInt(editingLimit.value, 10);
        if (isNaN(newValue)) {
            toast.error("Valeur invalide");
            return;
        }

        setIsSaving(true);
        try {
            await serviceRef.current.updateLimit(editingLimit.name, {
                plan: editingLimit.plan,
                value: newValue,
            });

            // Update local state optimistically
            setLimits(prev => ({
                ...prev,
                [editingLimit.name]: {
                    ...prev[editingLimit.name],
                    [editingLimit.plan]: newValue,
                },
            }));

            toast.success("Limitation mise à jour avec succès");
            setEditingLimit(null);
        } catch (error) {
            console.error("Failed to update limit:", error);
            toast.error("Erreur lors de la mise à jour");
        } finally {
            setIsSaving(false);
        }
    }, [editingLimit]);

    // Handle refresh cache
    const handleRefreshCache = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await serviceRef.current.refreshCache();
            toast.success("Cache rafraîchi avec succès");
            await loadLimits(true); // Force reload
        } catch (error) {
            console.error("Failed to refresh cache:", error);
            toast.error("Erreur lors du rafraîchissement du cache");
        } finally {
            setIsRefreshing(false);
        }
    }, [loadLimits]);

    // Don't render anything if still loading
    if (session.loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Don't render anything if user is loaded but not admin
    if (session.user && !isAdmin) {
        return null;
    }

    // If no user loaded
    if (!session.user) {
        return null;
    }

    return (
        <AuthGuard>
            <div className="flex flex-col gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-slate-50/50 via-indigo-50/30 to-purple-50/50">
                {/* Admin Header */}
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 sm:p-6 lg:p-8 text-white shadow-xl">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                                        Administration
                                    </div>
                                </div>
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                                    Gestion des limitations
                                </h1>
                                <p className="text-indigo-100 text-sm sm:text-base lg:text-lg max-w-2xl">
                                    Configurez les limitations de ressources pour
                                    les plans gratuit et premium
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <Settings className="w-12 h-12 text-white/60" />
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-4 right-8 w-20 h-20 bg-purple-300/20 rounded-full blur-lg"></div>
                </div>

                {/* Admin Notice */}
                <Card className="border-2 border-amber-200 bg-amber-50/50">
                    <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-amber-800">
                                    Mode Administrateur Activé
                                </p>
                                <p className="text-sm text-amber-700">
                                    Les modifications affectent immédiatement tous
                                    les utilisateurs. Valeur -1 = illimité.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end">
                    <Button
                        onClick={handleRefreshCache}
                        disabled={isRefreshing}
                        variant="outline"
                    >
                        {isRefreshing ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <RefreshCw className="w-4 h-4 mr-2" />
                        )}
                        Rafraîchir le cache
                    </Button>
                </div>

                {/* Limits Table */}
                <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Limitations par plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[300px]">
                                                Limitation
                                            </TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="text-center">
                                                Plan Gratuit
                                            </TableHead>
                                            <TableHead className="text-center">
                                                Plan Premium
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {limitEntries.map(([name, limitData]) => {
                                            const limitName = name as LimitName;
                                            return (
                                                <TableRow key={name}>
                                                    <TableCell className="font-medium">
                                                        {LIMIT_LABELS[limitName]}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-gray-600">
                                                        {limitData.description}
                                                    </TableCell>
                                                    {(["free", "premium"] as Plan[]).map(
                                                        plan => {
                                                            const isEditing =
                                                                editingLimit?.name ===
                                                                    limitName &&
                                                                editingLimit?.plan ===
                                                                    plan;
                                                            const currentValue =
                                                                limitData[plan];

                                                            return (
                                                                <TableCell
                                                                    key={plan}
                                                                    className="text-center"
                                                                >
                                                                    {isEditing ? (
                                                                        <div className="flex items-center justify-center gap-2">
                                                                            <Input
                                                                                type="number"
                                                                                value={
                                                                                    editingLimit.value
                                                                                }
                                                                                onChange={e =>
                                                                                    setEditingLimit(
                                                                                        {
                                                                                            ...editingLimit,
                                                                                            value: e
                                                                                                .target
                                                                                                .value,
                                                                                        }
                                                                                    )
                                                                                }
                                                                                className="w-24"
                                                                                disabled={
                                                                                    isSaving
                                                                                }
                                                                            />
                                                                            <Button
                                                                                size="sm"
                                                                                onClick={
                                                                                    handleSave
                                                                                }
                                                                                disabled={
                                                                                    isSaving
                                                                                }
                                                                            >
                                                                                {isSaving ? (
                                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                                ) : (
                                                                                    <Check className="w-4 h-4" />
                                                                                )}
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={
                                                                                    handleCancelEdit
                                                                                }
                                                                                disabled={
                                                                                    isSaving
                                                                                }
                                                                            >
                                                                                <X className="w-4 h-4" />
                                                                            </Button>
                                                                        </div>
                                                                    ) : (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                handleEdit(
                                                                                    limitName,
                                                                                    plan,
                                                                                    currentValue
                                                                                )
                                                                            }
                                                                            className="font-mono"
                                                                        >
                                                                            {formatLimitValue(
                                                                                currentValue
                                                                            )}
                                                                        </Button>
                                                                    )}
                                                                </TableCell>
                                                            );
                                                        }
                                                    )}
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card className="border-0 shadow-lg bg-blue-50/50">
                    <CardContent className="p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Note :</strong> Les modifications sont
                            appliquées immédiatement après sauvegarde. Utilisez -1
                            pour une valeur illimitée. Le cache est automatiquement
                            mis à jour après chaque modification.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AuthGuard>
    );
}
