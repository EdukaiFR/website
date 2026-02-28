import {
    Bell,
    Users,
    Home,
    Settings,
    Zap,
    GraduationCap,
    BarChart3,
    User,
    Sliders,
} from "lucide-react";
import { useIsAdmin } from "./useRole";

/*
  => Type for Links
  [
    {
      href: string, (link to redirect)
      label: string (public name to display in french instead of english TODO: use i18-next for translation)
      Icon: lucide-react (icon to display)
    },
  ]
*/

export function useLinks() {
    const isAdmin = useIsAdmin();

    const upLinks = [
        {
            href: "/",
            label: "Accueil",
            Icon: Home,
        },
        {
            href: "/generate",
            label: "Générer",
            Icon: Zap,
        },
        {
            href: "/club-edukai",
            label: "Club Edukai",
            Icon: Users,
        },
        {
            href: "/library",
            label: "Bibliothèque",
            Icon: GraduationCap,
        },
    ];

    const mySpaceLinks = [
        {
            href: "/stats",
            label: "Statistiques",
            Icon: BarChart3,
        },
        {
            href: "/profile",
            label: "Profile",
            Icon: User,
        },
    ];

    const downLinks = [
        {
            href: "/notifications",
            label: "Notifications",
            Icon: Bell,
        },
        {
            href: "/settings",
            label: "Paramètres",
            Icon: Settings,
        },
    ];

    const adminLinks = isAdmin
        ? [
              {
                  href: "/admin/plan-limits",
                  label: "Admin - Limitations",
                  Icon: Sliders,
              },
          ]
        : [];

    return { upLinks, mySpaceLinks, downLinks, adminLinks };
}
