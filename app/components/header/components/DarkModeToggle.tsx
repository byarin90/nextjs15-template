"use client";
import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

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
    
    if (isDarkMode) {
      localStorage.setItem('dark', 'true');
      document.documentElement.classList.add('dark');
    } else {
      localStorage.setItem('dark', 'false');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
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