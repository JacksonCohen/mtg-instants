"use client";

import { useState } from "react";
import Image from "next/image";
import type { ScryfallCard } from "@/lib/scryfall";
import { getCardImageUrl } from "@/lib/scryfall";
import { CardDetailModal } from "./card-detail-modal";

interface CardGridProps {
  cards: ScryfallCard[];
}

export function CardGrid({ cards }: CardGridProps) {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

  const handleNavigate = (direction: "next" | "prev") => {
    if (selectedCardIndex === null) return;

    if (direction === "next") {
      setSelectedCardIndex((selectedCardIndex + 1) % cards.length);
    } else {
      setSelectedCardIndex((selectedCardIndex - 1 + cards.length) % cards.length);
    }
  };

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <svg
          className="size-16 mb-4 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
          />
        </svg>
        <p className="text-lg font-medium">No instant cards found</p>
        <p className="text-sm">Try adjusting your filters</p>
      </div>
    );
  }

  const selectedCard = selectedCardIndex !== null ? cards[selectedCardIndex] : null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {cards.map((card, index) => (
          <CardTile
            key={card.id}
            card={card}
            onClick={() => setSelectedCardIndex(index)}
          />
        ))}
      </div>

      <CardDetailModal
        card={selectedCard}
        isOpen={selectedCardIndex !== null}
        onClose={() => setSelectedCardIndex(null)}
        onNavigate={handleNavigate}
        currentIndex={selectedCardIndex ?? 0}
        totalCards={cards.length}
      />
    </>
  );
}

interface CardTileProps {
  card: ScryfallCard;
  onClick: () => void;
}

function CardTile({ card, onClick }: CardTileProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageUrl = getCardImageUrl(card, "normal");

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative aspect-488/680 rounded-lg overflow-hidden bg-secondary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background cursor-pointer"
    >
      {/* Loading skeleton */}
      {!imageLoaded && (
        <div className="absolute inset-0 animate-pulse bg-linear-to-br from-secondary to-muted" />
      )}

      {/* Card image */}
      {imageUrl && (
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={card.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1536px) 25vw, 16vw"
          className={`object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImageLoaded(true)}
          priority={false}
        />
      )}

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-lg ring-2 ring-transparent group-hover:ring-primary/50 transition-all duration-300" />
    </button>
  );
}
