/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect } from "react";
import {
    ForbiddenErrorPage,
    UnauthorizedErrorPage,
    GenericErrorPage,
} from "@/components/errors";
import { isForbiddenError, isUnauthorizedError, logError } from "@/lib/errors";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log structuré pour le debugging et monitoring
        logError(error);
    }, [error]);

    // Détection robuste des types d'erreurs
    if (isForbiddenError(error)) {
        return <ForbiddenErrorPage reset={reset} />;
    }

    if (isUnauthorizedError(error)) {
        return <UnauthorizedErrorPage reset={reset} />;
    }

    // Erreur générique pour tous les autres cas
    return <GenericErrorPage error={error} reset={reset} />;
}
