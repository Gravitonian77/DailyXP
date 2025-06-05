/**
 * Spacing system based on 8px grid
 * Used for consistent margins, paddings, and layout spacing
 */

export const Spacing = {
  xs: 4, // Extra small: 4px
  sm: 8, // Small: 8px
  md: 16, // Medium: 16px
  lg: 24, // Large: 24px
  xl: 32, // Extra large: 32px
  xxl: 48, // 2x Extra large: 48px
  xxxl: 64, // 3x Extra large: 64px
};

// Grid system for consistent layouts
export const Grid = {
  container: {
    sm: 640, // Small container max width
    md: 768, // Medium container max width
    lg: 1024, // Large container max width
    xl: 1280, // Extra large container max width
  },
  gutter: {
    sm: 16, // Small gutter (8px on each side)
    md: 24, // Medium gutter (12px on each side)
    lg: 32, // Large gutter (16px on each side)
  },
};

// Border radius system
export const BorderRadius = {
  xs: 4, // Extra small: 4px
  sm: 8, // Small: 8px
  md: 12, // Medium: 12px
  lg: 16, // Large: 16px
  xl: 24, // Extra large: 24px
  full: 9999, // Full circle: 9999px
};

// Shadow levels
export const Elevation = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
};

// Animation timing
export const AnimationTiming = {
  fast: 150, // Fast animation: 150ms
  normal: 250, // Normal animation: 250ms
  slow: 400, // Slow animation: 400ms
};

export default Spacing;