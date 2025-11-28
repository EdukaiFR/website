/**
 * Format a date string to a relative format in French
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Aujourd'hui à 14:30", "Il y a 3 jours à 10:15")
 */
export const formatRelativeDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    const timeString = date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    if (diffInDays === 0) return `Aujourd'hui à ${timeString}`;
    if (diffInDays === 1) return `Hier à ${timeString}`;
    if (diffInDays < 7) return `Il y a ${diffInDays} jours à ${timeString}`;

    return (
        date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }) + ` à ${timeString}`
    );
};

/**
 * Format a date string to a full French date with time
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "15 janvier 2025 à 14:30")
 */
export const formatFullDate = (dateString: string): string => {
    const date = new Date(dateString);
    return (
        date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }) +
        " à " +
        date.toLocaleTimeString("fr-FR", {
            hour: "numeric",
            minute: "2-digit",
        })
    );
};
