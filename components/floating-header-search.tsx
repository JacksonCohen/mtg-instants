"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface FloatingHeaderSearchProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export function FloatingHeaderSearch({ onSearchChange, searchQuery }: FloatingHeaderSearchProps) {
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show floating search after scrolling past ~300px (roughly past hero section)
      setShowFloating(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`transition-all duration-300 overflow-hidden ${
        showFloating ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search sets..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-9 h-10 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>
  );
}
