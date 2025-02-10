"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  // TODO: Create a useNavigation hook to handle useRouter and other navigation-related logic
  // const router = useRouter();
  // const { getProfile } = useProfile();
  // const [profile, setProfile] = useState<any>(null);
  // const { user, loading } = useUser();
  // const [userId, setUserId] = useState<string | null>(null);

  // const fetchProfile = async (userId: string) => {
  //   try {
  //     const profile = await getProfile(userId);
  //     setProfile(profile);
  //   } catch (error: any) {
  //     console.error("Error fetching profile:", error.message);
  //   }
  // };

  // useEffect(() => {
  //   if (!loading && user?.id && !userId) {
  //     fetchProfile(user.id);
  //     setUserId(user.id);
  //   }
  // }, [user, loading]);

  // if (loading || !user || !profile) {
  //   return <p>Loading user information...</p>;
  // }

  return <div className="flex flex-1 flex-col gap-4 p-4 pt-0">OUIIIII</div>;
}
