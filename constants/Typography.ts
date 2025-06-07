import { Platform } from 'react-native';

export const FontFamily = {
  heading: Platform.select({
    web: '"Pixelify Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    default: 'PixelifySans',
  }),
  body: Platform.select({
    web: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    default: 'Inter',
  }),
};

export const FontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  md: 18,
  lg: 20,
  xl: 24,
  '2xl': 30,
  '3xl': 36,
  '4xl': 48,
};

export const FontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  rn_normal: 400,
  rn_medium: 500,
  rn_semibold: 600,
  rn_bold: 700,
};

export const LineHeight = {
  none: 0,             // or FontSize if button needs space
  tight: 24,           // ✅ was 1.2 — now appropriate for lg (20px font)
  normal: 28,          // ✅ use for base-18/20px fonts
  loose: 32,           // optional
};


export const Typography = {
  h1: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize['3xl'],
    lineHeight: LineHeight.tight,
  },
  h2: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize['2xl'],
    lineHeight: LineHeight.tight,
  },
  h3: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.xl,
    lineHeight: LineHeight.tight,
  },
  h4: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.lg,
    lineHeight: LineHeight.normal,
  },
  h5: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.base,
    lineHeight: LineHeight.normal,
  },
  h6: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.base,
    lineHeight: LineHeight.tight,
  },
  body1: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.md,
    lineHeight: LineHeight.normal,
  },
  body2: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    lineHeight: LineHeight.normal,
  },
  subtitle1: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    lineHeight: LineHeight.normal,
  },
  subtitle2: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.normal,
  },
  caption: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    lineHeight: LineHeight.normal,
  },
  button: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.base,
    lineHeight: LineHeight.none,
    textTransform: 'uppercase' as const,
  },
  overline: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    lineHeight: LineHeight.none,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
};

export default Typography;