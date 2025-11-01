
import { useTheme } from "@/components/ui/theme-provider";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function DarkLightThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Determine current theme state (including when not mounted or theme is null)
  const isDark = theme === "dark" || (!mounted && typeof document !== "undefined" && document.documentElement.classList.contains("dark"));

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl bg-accent/30 hover:bg-accent/50 border border-border/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:ring-offset-2 group"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <Sun
          className={`absolute inset-0 w-5 h-5 text-muted-foreground group-hover:text-foreground transition-all duration-300 group-hover:scale-110 ${
            !isDark
              ? "rotate-0 scale-100 opacity-100"
              : "rotate-90 scale-0 opacity-0"
          }`}
        />
        <Moon
          className={`absolute inset-0 w-5 h-5 text-muted-foreground group-hover:text-foreground transition-all duration-300 group-hover:scale-110 ${
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>
    </button>
  );
}

