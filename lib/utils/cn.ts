import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for proper merging
 *
 * @param inputs - Class values to merge
 * @returns Merged class string
 *
 * @example
 * ```tsx
 * cn('text-red-500', condition && 'bg-blue-500', 'p-4')
 * // => 'text-red-500 bg-blue-500 p-4'
 *
 * cn('text-red-500 hover:text-blue-500', 'hover:text-green-500')
 * // => 'text-red-500 hover:text-green-500'
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Type-safe class name utility with better TypeScript support
 */
export type ClassNameValue = ClassValue;

/**
 * Helper to create conditional classes
 */
export function conditionalClass(condition: boolean, className: string): string {
  return condition ? className : '';
}

/**
 * Helper to create variant classes
 */
export function variantClass<T extends Record<string, string>>(
  variants: T,
  variant: keyof T
): string {
  return variants[variant];
}

/**
 * Common class combinations for reuse
 */
export const COMMON_CLASSES = {
  // Layout
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexCol: 'flex flex-col',
  flexColCenter: 'flex flex-col items-center justify-center',

  // Spacing
  spacingSm: 'space-x-2 space-y-2',
  spacingMd: 'space-x-4 space-y-4',
  spacingLg: 'space-x-6 space-y-6',

  // Typography
  textGradient: 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
  textTruncate: 'truncate',
  textEllipsis: 'text-ellipsis overflow-hidden',

  // Interactive
  interactive: 'transition-colors duration-200 hover:opacity-80',
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',

  // Status
  statusSuccess: 'text-green-600 bg-green-50 border-green-200',
  statusError: 'text-red-600 bg-red-50 border-red-200',
  statusWarning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  statusInfo: 'text-blue-600 bg-blue-50 border-blue-200',

  // Loading
  loadingSpinner: 'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
} as const;