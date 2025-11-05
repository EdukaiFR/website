import { CheckCircle2, LucideIcon } from "lucide-react";

export interface FeatureConfig {
    text: string;
    icon: LucideIcon;
}

export const features: FeatureConfig[] = [
    { text: "Génération en 20 secondes", icon: CheckCircle2 },
    { text: "Questions personnalisées", icon: CheckCircle2 },
    { text: "Suivi de progression", icon: CheckCircle2 },
    { text: "100% gratuit", icon: CheckCircle2 },
];
