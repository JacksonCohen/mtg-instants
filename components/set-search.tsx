"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ScryfallSet } from "@/lib/scryfall";
import { cn } from "@/lib/utils";

interface SetSearchProps {
  sets: ScryfallSet[];
  currentSetCode?: string;
}

export function SetSearch({ sets, currentSetCode }: SetSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredSets = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return sets
      .filter((set) => {
        // Exact match on code takes priority
        if (set.code.toLowerCase() === query) return true;
        // Otherwise search in name or code
        return (
          set.name.toLowerCase().includes(query) ||
          set.code.toLowerCase().includes(query)
        );
      })
      .slice(0, 8); // Limit to 8 results
  }, [sets, searchQuery]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || filteredSets.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredSets.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + filteredSets.length) % filteredSets.length
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredSets[selectedIndex]) {
          navigateToSet(filteredSets[selectedIndex].code);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery("");
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredSets, selectedIndex]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const navigateToSet = (setCode: string) => {
    setIsOpen(false);
    setSearchQuery("");
    inputRef.current?.blur();
    router.push(`/set/${setCode}`);
  };

  return (
    <div className="relative">
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Jump to set..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-9 h-9 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary text-sm"
        />
      </div>

      {/* Dropdown */}
      {isOpen && filteredSets.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-1 w-full bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-50"
        >
          {filteredSets.map((set, index) => {
            const isCurrent = set.code === currentSetCode;
            const isSelected = index === selectedIndex;
            return (
              <button
                key={set.id}
                type="button"
                onClick={() => navigateToSet(set.code)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm transition-colors flex items-center justify-between gap-2 cursor-pointer group",
                  isSelected && "bg-accent text-white",
                  isCurrent && "opacity-50 cursor-default"
                )}
                disabled={isCurrent}
              >
                <div className="flex flex-col overflow-hidden">
                  <span className="font-medium text-foreground truncate">
                    {set.name}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase">
                    {set.code}
                  </span>
                </div>
                {isCurrent && (
                  <span className="text-xs text-muted-foreground shrink-0">
                    Current
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* No results */}
      {isOpen && searchQuery && filteredSets.length === 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-1 w-full bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-50 px-3 py-4"
        >
          <p className="text-sm text-muted-foreground text-center">
            No sets found
          </p>
        </div>
      )}
    </div>
  );
}
