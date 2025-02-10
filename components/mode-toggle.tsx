"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const router = useRouter();

  React.useEffect(() => {
    router.refresh();
    // update the c
  }, [setTheme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="flex items-center gap-2 relative"
        >
          <span className="relative block h-[1rem] w-[1rem]">
            <Sun className="absolute inset-0 transition-transform duration-300 dark:opacity-0 dark:scale-0" />
            <Moon className="absolute inset-0 transition-transform duration-300 opacity-0 scale-0 dark:opacity-100 dark:scale-100" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-md shadow-lg p-2 border border-gray-200 dark:border-gray-700 w-36"
      >
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
