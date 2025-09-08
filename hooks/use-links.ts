import {
    Bell,
    Users,
    Home,
    BookOpen,
    HelpCircle,
    Settings,
    Zap,
    GraduationCap,
    Shield,
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

    const downLinks = [
        {
            href: "/notifications",
            label: "Notifications",
            Icon: Bell,
        },
        {
            href: "/tickets",
            label: "Support",
            Icon: HelpCircle,
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
                  href: "/admin/tickets",
                  label: "Admin - Tickets",
                  Icon: Shield,
              },
          ]
        : [];

    return { upLinks, downLinks, adminLinks };
}
