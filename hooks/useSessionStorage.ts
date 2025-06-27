import { useEffect, useState } from "react";
import { sessionStorage } from "@/lib/session";

export function useSessionStorage() {
    const [storageUserData, setUserData] = useState<any>(null);
    const [storageUserId, setUserId] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            const data = await sessionStorage.getUser();
            setUserData(data);
            setUserId(data._id);
        };
        fetchUserData();
    }, []);

    return { storageUserData, storageUserId };
}
