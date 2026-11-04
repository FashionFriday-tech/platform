import { MAJOR_COLORS } from '@ff/schemas';

/**
 * Format a raw color code/name for customer display.
 * Resolves hex values (e.g. #F5F5DC -> 'Beige') and filters out generic 'Standard'.
 */
export function formatColorLabel(color?: string | null): string {
  if (!color) {
    return '';
  }
  const trimmed = color.trim();
  if (trimmed.toLowerCase() === 'standard') {
    return '';
  }

  if (trimmed.startsWith('#')) {
    const match = MAJOR_COLORS.find((c) => c.hex.toLowerCase() === trimmed.toLowerCase());
    return match ? match.name : trimmed;
  }

  return trimmed;
}
