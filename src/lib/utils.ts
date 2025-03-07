import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names using clsx and tailwind-merge
 * This utility is commonly used for conditional class names in React components
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 