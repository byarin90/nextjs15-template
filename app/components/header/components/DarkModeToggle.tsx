// DarkModeToggle.client.tsx
"use client";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { updateDarkMode } from "@/app/actions/auth/actions";

const DarkModeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    const darkModePreference = localStorage.getItem('dark') === 'true';
    setIsDarkMode(darkModePreference);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem('dark', isDarkMode ? 'true' : 'false');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode, mounted]);

  if (!mounted) return null;

  return (
    <button
      onClick={async () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        await updateDarkMode(newMode);
      }}
      className="
        flex items-center 
        p-2 
        bg-colors-secondary/10 
        dark:bg-colors-secondary/20
        transition-colors 
        duration-300 
        rounded-full
        hover:bg-colors-accent/20
      "
      title="Toggle Dark Mode"
    >
      {isDarkMode ? (
        <SunIcon className="h-6 w-6 text-colors-warning" />
      ) : (
        <MoonIcon className="h-6 w-6 text-colors-accent" />
      )}
    </button>
  );
};

export default DarkModeToggle;