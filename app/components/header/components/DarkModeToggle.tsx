"use client";
import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';


const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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