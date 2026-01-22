// Utility functions for parsing mana strings like "FUU" or "forest island island"

export interface ManaParseResult {
  colors: string[];
  manaValues: number[];
}

// Map of common mana representations to color codes
const MANA_MAP: Record<string, string> = {
  // Single letter codes (standard)
  'W': 'W',
  'U': 'U',
  'B': 'B',
  'R': 'R',
  'G': 'G',
  'C': 'C',

  // Full color names
  'WHITE': 'W',
  'BLUE': 'U',
  'BLACK': 'B',
  'RED': 'R',
  'GREEN': 'G',
  'COLORLESS': 'C',

  // Land names (case insensitive matching happens before this)
  'PLAINS': 'W',
  'ISLAND': 'U',
  'SWAMP': 'B',
  'MOUNTAIN': 'R',
  'FOREST': 'G',
  'WASTES': 'C',
};

/**
 * Parse a mana string like "FUU", "forest island island", or "GGG"
 * into colors and possible mana values
 *
 * @param input - The mana string to parse (e.g., "FUU", "forest island island")
 * @returns Object containing arrays of colors and mana values
 */
export function parseManaString(input: string): ManaParseResult {
  if (!input || input.trim() === '') {
    return { colors: [], manaValues: [] };
  }

  const normalized = input.toUpperCase().trim();
  const colors = new Set<string>();
  const manaCount: Record<string, number> = {};

  // Try to parse as space-separated words first (e.g., "forest island island")
  const words = normalized.split(/\s+/);
  if (words.length > 1) {
    for (const word of words) {
      const color = MANA_MAP[word];
      if (color) {
        colors.add(color);
        manaCount[color] = (manaCount[color] || 0) + 1;
      }
    }
  }

  // If no words matched, try single-character parsing (e.g., "FUU" or "GGG")
  if (colors.size === 0) {
    for (const char of normalized) {
      const color = MANA_MAP[char];
      if (color) {
        colors.add(color);
        manaCount[color] = (manaCount[color] || 0) + 1;
      }
    }
  }

  // Calculate total mana count
  const totalMana = Object.values(manaCount).reduce((sum, count) => sum + count, 0);

  // Generate all possible mana values from 0 up to total mana
  // For example, if they have "FUU" (3 mana), they can cast cards with MV 0, 1, 2, or 3
  const manaValues: number[] = [];
  for (let i = 0; i <= totalMana; i++) {
    manaValues.push(i);
  }

  return {
    colors: Array.from(colors),
    manaValues
  };
}

/**
 * Check if a mana string is valid (contains at least one recognized mana symbol)
 */
export function isValidManaString(input: string): boolean {
  const result = parseManaString(input);
  return result.colors.length > 0;
}
