const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

export const sessionStorage = {
    setToken: (token: string) => {
        if (typeof window !== "undefined") {
            localStorage.setItem(TOKEN_KEY, token);
        }
    },

    getToken: () => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem(TOKEN_KEY);
            if (token && token !== "undefined" && token !== "null") {
                return token;
            }
        }
        return null;
    },

    setUser: (user: unknown) => {
        if (typeof window !== "undefined") {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
    },

    getUser: () => {
        if (typeof window !== "undefined") {
            const user = localStorage.getItem(USER_KEY);

            if (user && user !== "undefined") {
                try {
                    const parsedUser = JSON.parse(user);
                    return parsedUser;
                } catch (error) {
                    console.error("Error parsing user data:", error);
                    localStorage.removeItem(USER_KEY);
                    return null;
                }
            }
        }
        return null;
    },

    clearSession: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        }
    },

    // Clean up any invalid data
    cleanupInvalidData: () => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem(TOKEN_KEY);
            const user = localStorage.getItem(USER_KEY);

            if (token === "undefined" || token === "null") {
                localStorage.removeItem(TOKEN_KEY);
            }

            if (user === "undefined" || user === "null") {
                localStorage.removeItem(USER_KEY);
            }
        }
    },
};
