"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "@/hooks/useSession";
import { UserProfile, getUserProfileAction } from "@/lib/actions/user";

interface UserContextType {
    userProfile: UserProfile | null;
    loading: boolean;
    refreshUserProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const { user, loading: sessionLoading } = useSession();

    // Function to refresh user profile from new API
    const refreshUserProfile = async () => {
        if (!user) {
            setUserProfile(null);
            return;
        }

        try {
            setLoading(true);
            const result = await getUserProfileAction();
            if (result.success && result.data) {
                setUserProfile(result.data);
            } else {
                // Fallback to session user data if new API fails
                if (user) {
                    setUserProfile({
                        _id: user.id,
                        email: user.email || "",
                        username: user.username || "",
                        firstName: user.firstName || "",
                        lastName: user.lastName || "",
                        profilePic: (user as any).profilePic || undefined,
                        grade: "",
                        levelOfStudy: "",
                        institution: undefined,
                        accountPlan: "free",
                        role: "user",
                    });
                }
            }
        } catch (error) {
            console.error("Error refreshing user profile:", error);
            // Fallback to session user data
            if (user) {
                setUserProfile({
                    _id: user.id,
                    email: user.email || "",
                    username: user.username || "",
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    profilePic: (user as any).profilePic || undefined,
                    grade: "",
                    levelOfStudy: "",
                    institution: undefined,
                    accountPlan: "free",
                    role: "user",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // Load user profile when user changes
    useEffect(() => {
        if (!sessionLoading) {
            if (user) {
                refreshUserProfile();
            } else {
                setUserProfile(null);
                setLoading(false);
            }
        }
    }, [user, sessionLoading]);

    return (
        <UserContext.Provider
            value={{
                userProfile,
                loading: loading || sessionLoading,
                refreshUserProfile,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUserProfile() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUserProfile must be used within a UserProvider");
    }
    return context;
}
