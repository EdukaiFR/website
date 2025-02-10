import {
  Bell,
  Earth,
  LayoutDashboard,
  LibraryBig,
  LifeBuoy,
  Settings,
  Sparkles,
} from "lucide-react";

export function useLinks() {
  const upLinks = [
    {
      href: "/",
      label: "Accueil",
      Icon: LayoutDashboard,
    },
    {
      href: "/generate",
      label: "Générer",
      Icon: Sparkles,
    },
    {
      href: "/club-edukai",
      label: "Club Edukai",
      Icon: Earth,
    },
    {
      href: "/library",
      label: "Bibliothèque",
      Icon: LibraryBig,
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
      Icon: LifeBuoy,
    },
    {
      href: "/settings",
      label: "Paramètres",
      Icon: Settings,
    },
  ];

  return { upLinks, downLinks };
}
