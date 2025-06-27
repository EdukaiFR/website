import { useEffect, useState } from "react";
import { sessionStorage } from "@/lib/session";

export function useSessionStorage() {
    const [userData, setUserData] = useState<any>(null);
    const [userId, setUserId] = useState("");

    useEffect(() => {
    const fetchUserData = async () => {
        const data = await sessionStorage.getUser();
        setUserData(data);
        setUserId(data._id);
    };
    fetchUserData();
    }, []);

    return { userData, userId };
}
