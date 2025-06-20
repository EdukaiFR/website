import {
  Bell,
  Users,
  Home,
  BookOpen,
  HelpCircle,
  Settings,
  Zap,
  GraduationCap,
} from "lucide-react";

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
      href: "/support",
      label: "Assistance",
      Icon: HelpCircle,
    },
    {
      href: "/settings",
      label: "Paramètres",
      Icon: Settings,
    },
  ];

  return { upLinks, downLinks };
}
