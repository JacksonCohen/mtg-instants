"use client";

import { useState } from "react";
import { SetGrid } from "@/components/set-grid";
import { FloatingHeaderSearch } from "@/components/floating-header-search";
import type { ScryfallSet } from "@/lib/scryfall";

interface HomePageClientProps {
  sets: ScryfallSet[];
}

export function HomePageClient({ sets }: HomePageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      {/* Floating search for header - rendered here but positioned in header via portal effect */}
      <FloatingHeaderSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="container mx-auto px-4 py-8">
        <SetGrid sets={sets} searchQuery={searchQuery} />
      </main>
    </>
  );
}
