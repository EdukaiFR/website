import {
    CheckCircle2,
    Sparkles,
    Star,
    TrendingUp,
    Users,
    Zap,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface FallingIconConfig {
    Icon: LucideIcon;
    delay: number;
    duration: number;
    left: string;
}

export const fallingIcons: FallingIconConfig[] = [
    // First wave
    { Icon: Sparkles, delay: 0, duration: 15, left: "5%" },
    { Icon: Star, delay: 2, duration: 18, left: "10%" },
    { Icon: Zap, delay: 4, duration: 16, left: "15%" },
    { Icon: TrendingUp, delay: 1, duration: 17, left: "20%" },
    { Icon: Users, delay: 3, duration: 19, left: "25%" },
    { Icon: CheckCircle2, delay: 5, duration: 15, left: "30%" },
    { Icon: Star, delay: 2.5, duration: 16, left: "35%" },
    { Icon: Sparkles, delay: 4.5, duration: 18, left: "40%" },
    { Icon: Zap, delay: 1.5, duration: 17, left: "45%" },
    { Icon: TrendingUp, delay: 3.5, duration: 16, left: "50%" },

    // Second wave
    { Icon: Users, delay: 0.5, duration: 18, left: "55%" },
    { Icon: CheckCircle2, delay: 2.8, duration: 15, left: "60%" },
    { Icon: Sparkles, delay: 4.2, duration: 17, left: "65%" },
    { Icon: Star, delay: 1.8, duration: 19, left: "70%" },
    { Icon: Zap, delay: 3.2, duration: 16, left: "75%" },
    { Icon: TrendingUp, delay: 5.5, duration: 18, left: "80%" },
    { Icon: Users, delay: 2.2, duration: 15, left: "85%" },
    { Icon: Sparkles, delay: 4.8, duration: 17, left: "90%" },
    { Icon: Star, delay: 1.2, duration: 16, left: "95%" },

    // Third wave - intermediate positions
    { Icon: CheckCircle2, delay: 6, duration: 19, left: "8%" },
    { Icon: Zap, delay: 7, duration: 15, left: "18%" },
    { Icon: Star, delay: 6.5, duration: 18, left: "28%" },
    { Icon: Sparkles, delay: 7.5, duration: 16, left: "38%" },
    { Icon: TrendingUp, delay: 8, duration: 17, left: "48%" },
    { Icon: Users, delay: 6.8, duration: 19, left: "58%" },
    { Icon: CheckCircle2, delay: 7.2, duration: 15, left: "68%" },
    { Icon: Zap, delay: 8.5, duration: 18, left: "78%" },
    { Icon: Star, delay: 7.8, duration: 16, left: "88%" },

    // Fourth wave - more variations
    { Icon: Sparkles, delay: 9, duration: 17, left: "12%" },
    { Icon: TrendingUp, delay: 9.5, duration: 19, left: "22%" },
    { Icon: Users, delay: 10, duration: 15, left: "32%" },
    { Icon: Star, delay: 9.2, duration: 18, left: "42%" },
    { Icon: CheckCircle2, delay: 10.5, duration: 16, left: "52%" },
    { Icon: Zap, delay: 9.8, duration: 17, left: "62%" },
    { Icon: Sparkles, delay: 11, duration: 19, left: "72%" },
    { Icon: TrendingUp, delay: 10.2, duration: 15, left: "82%" },
    { Icon: Users, delay: 11.5, duration: 18, left: "92%" },
];
