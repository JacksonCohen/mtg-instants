// Scryfall API utilities for MTG card data

export interface ScryfallSet {
  id: string;
  code: string;
  name: string;
  set_type: string;
  released_at: string;
  card_count: number;
  icon_svg_uri: string;
  scryfall_uri: string;
}

export interface ScryfallCard {
  id: string;
  name: string;
  mana_cost: string;
  cmc: number;
  type_line: string;
  oracle_text: string;
  colors: string[];
  color_identity: string[];
  rarity: string;
  set: string;
  set_name: string;
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    art_crop: string;
  };
  card_faces?: Array<{
    name: string;
    mana_cost: string;
    oracle_text: string;
    image_uris?: {
      small: string;
      normal: string;
      large: string;
      art_crop: string;
    };
  }>;
  scryfall_uri: string;
  legalities: Record<string, string>;
}

export interface ScryfallListResponse<T> {
  object: string;
  total_cards?: number;
  has_more: boolean;
  next_page?: string;
  data: T[];
}

// Counter-spell classification
export type CounterType = 
  | 'hard_counter'
  | 'conditional_counter'
  | 'soft_counter'
  | 'protection'
  | 'ability_counter';

export interface CounterClassification {
  type: CounterType;
  label: string;
  description: string;
}

export const COUNTER_CLASSIFICATIONS: Record<CounterType, CounterClassification> = {
  hard_counter: {
    type: 'hard_counter',
    label: 'Hard Counter',
    description: 'Counter target spell unconditionally'
  },
  conditional_counter: {
    type: 'conditional_counter',
    label: 'Conditional Counter',
    description: 'Counter unless controller pays or meets a condition'
  },
  soft_counter: {
    type: 'soft_counter',
    label: 'Soft / Tempo Counter',
    description: 'Counter and return to hand, or similar tempo effects'
  },
  protection: {
    type: 'protection',
    label: 'Protection / Pseudo-Counter',
    description: 'Hexproof, indestructible, redirect, or "can\'t be countered" prevention'
  },
  ability_counter: {
    type: 'ability_counter',
    label: 'Ability Counter',
    description: 'Counter activated or triggered abilities'
  }
};

export function classifyCounterSpell(oracleText: string): CounterType | null {
  const text = oracleText.toLowerCase();
  
  // Check for ability counters first (more specific)
  if (text.includes('counter target activated') || text.includes('counter target triggered')) {
    return 'ability_counter';
  }
  
  // Soft/tempo counters
  if ((text.includes('counter') && text.includes('return')) || 
      text.includes('counter target spell. its controller') ||
      text.includes('remand')) {
    return 'soft_counter';
  }
  
  // Conditional counters
  if (text.includes('counter target spell unless') ||
      text.includes('counter target') && text.includes('if it')) {
    return 'conditional_counter';
  }
  
  // Hard counters
  if (text.match(/counter target (spell|creature spell|instant|sorcery|artifact|enchantment|planeswalker)/)) {
    return 'hard_counter';
  }
  
  // Protection spells
  if (text.includes('hexproof') || 
      text.includes('indestructible') ||
      text.includes('protection from') ||
      text.includes('can\'t be countered') ||
      text.includes('change the target') ||
      text.includes('redirect')) {
    return 'protection';
  }
  
  return null;
}

// Returns true only for actual counterspells (not protection/hexproof effects)
export function isCounterspell(oracleText: string): boolean {
  const type = classifyCounterSpell(oracleText);
  return type === 'hard_counter' || type === 'conditional_counter' || type === 'soft_counter' || type === 'ability_counter';
}

// Get card image URL with fallback for double-faced cards
export function getCardImageUrl(card: ScryfallCard, size: 'small' | 'normal' | 'large' = 'normal'): string {
  if (card.image_uris) {
    return card.image_uris[size];
  }
  if (card.card_faces && card.card_faces[0]?.image_uris) {
    return card.card_faces[0].image_uris[size];
  }
  return '';
}

// Get full oracle text for double-faced cards
export function getOracleText(card: ScryfallCard): string {
  if (card.oracle_text) {
    return card.oracle_text;
  }
  if (card.card_faces) {
    return card.card_faces.map(face => face.oracle_text).join('\n\n// \n\n');
  }
  return '';
}

// Parse mana symbols from mana cost string
export function parseManaSymbols(manaCost: string): string[] {
  const matches = manaCost.match(/\{[^}]+\}/g);
  return matches || [];
}

// Get colors from a card
export function getCardColors(card: ScryfallCard): string[] {
  if (card.colors && card.colors.length > 0) {
    return card.colors;
  }
  if (card.color_identity && card.color_identity.length > 0) {
    return card.color_identity;
  }
  return ['C']; // Colorless
}
