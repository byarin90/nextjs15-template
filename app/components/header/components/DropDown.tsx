"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useState } from "react";

const DropDown = ({
  items,
  label,
}: {
  items: { label: string; href: string }[];
  label: string;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsDropdownOpen(true)} 
      onMouseLeave={() => setIsDropdownOpen(false)} 
    >
      <button
        className="inline-flex items-center hover:text-indigo-300 transition"
      >
        {label}
        <ChevronDownIcon className="h-5 w-5 ml-1" />
      </button>

      {isDropdownOpen && (
        <div
          className="absolute pt-2 w-48 
                     dark:bg-colors-primary dark:text-white
                     bg-white text-color-bg-colors-primary
                     shadow-lg rounded-md py-2 transition"
        >
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="block px-4 py-2 hover:bg-gray-700 dark:hover:bg-gray-600 hover:text-colors-primary transition"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDown;