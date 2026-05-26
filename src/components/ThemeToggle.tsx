"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-foreground/5 text-foreground transition-colors relative flex items-center justify-center overflow-hidden w-9 h-9"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <Sun className={`w-5 h-5 absolute transition-all duration-300 ${resolvedTheme === "dark" ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"}`} />
      <Moon className={`w-5 h-5 absolute transition-all duration-300 ${resolvedTheme === "dark" ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"}`} />
    </button>
  );
}
