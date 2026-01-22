import { notFound } from "next/navigation";
import { fetchSets, fetchInstantsFromSet } from "@/lib/scryfall-server";
import { SetPageClient } from "./set-page-client";

interface SetPageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: SetPageProps) {
  const { code } = await params;
  const sets = await fetchSets();
  const set = sets.find((s) => s.code.toLowerCase() === code.toLowerCase());

  if (!set) {
    return {
      title: "Set Not Found - MTG Counterplay Reference",
    };
  }

  return {
    title: `${set.name} Instant-Speed Cards - MTG Counterplay Reference`,
    description: `Browse all instant-speed cards, counterspells, flash creatures, and interaction from ${set.name} (${set.code.toUpperCase()})`,
  };
}

export default async function SetPage({ params }: SetPageProps) {
  const { code } = await params;
  const [sets, cards] = await Promise.all([
    fetchSets(),
    fetchInstantsFromSet(code),
  ]);

  const set = sets.find((s) => s.code.toLowerCase() === code.toLowerCase());

  if (!set) {
    notFound();
  }

  return <SetPageClient set={set} sets={sets} cards={cards} />;
}
