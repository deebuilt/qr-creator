import type { Options, DotType, CornerSquareType, CornerDotType } from 'qr-code-styling';
import type { QRConfig } from '@/types/qr';

// ── Scan-safety helpers ──────────────────────────────────────────────────────
// A paid QR that doesn't scan is a refund. These keep every styling choice
// inside the range that real scanners tolerate.

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

// Relative luminance (WCAG). Used for the foreground/background contrast check.
function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(fg: string, bg: string): number {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

// Scanners need clearly-darker modules on a clearly-lighter field (or vice
// versa). Below ~3:1 the code gets flaky, so we surface a warning in the UI.
export const MIN_SCAN_CONTRAST = 3;

export function isContrastSafe(fg: string, bg: string): boolean {
  return contrastRatio(fg, bg) >= MIN_SCAN_CONTRAST;
}

export function adjustBrightness(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const nr = clamp(r + amount);
  const ng = clamp(g + amount);
  const nb = clamp(b + amount);
  return `#${((1 << 24) + (nr << 16) + (ng << 8) + nb).toString(16).slice(1)}`;
}

// ── Options builder ──────────────────────────────────────────────────────────

export function buildOptions(config: QRConfig): Options {
  const dotType = config.dotStyle as DotType;
  const cornersSquareType = config.eyeStyle as CornerSquareType;
  // The inner eye dot reads best a touch simpler than the frame: a "dot" frame
  // pairs with a dot center, everything else with a solid square center.
  const cornersDotType: CornerDotType =
    config.eyeStyle === 'dot' ? 'dot' : config.eyeStyle === 'square' ? 'square' : 'dot';

  const eyeColor = config.eyeColor ?? config.fgColor;

  const opts: Options = {
    width: 280,
    height: 280,
    data: config.url || 'https://placeholder.test',
    dotsOptions: config.useGradient
      ? {
          type: dotType,
          gradient: {
            type: config.gradientType,
            rotation: Math.PI / 4,
            colorStops: [
              { offset: 0, color: config.fgColor },
              { offset: 1, color: config.gradientColor },
            ],
          },
        }
      : {
          type: dotType,
          color: config.fgColor,
        },
    cornersSquareOptions: {
      type: cornersSquareType,
      color: eyeColor,
    },
    cornersDotOptions: {
      type: cornersDotType,
      color: eyeColor,
    },
    backgroundOptions: {
      color: config.bgColor,
    },
    qrOptions: {
      // Level H recovers ~30% of the code — this is what lets a center logo and
      // heavier styling stay scannable. Always on.
      errorCorrectionLevel: 'H',
    },
    // The quiet zone (margin) is not decorative — scanners need it. Even with
    // "border" off we keep a minimum 2-module-ish quiet zone so it still reads.
    margin: config.includeBorder ? 16 : 8,
  };

  if (config.logoDataUrl) {
    opts.image = config.logoDataUrl;
    opts.imageOptions = {
      crossOrigin: 'anonymous',
      margin: 4,
      // Cap logo coverage; larger than this eats past even level-H recovery.
      imageSize: 0.28,
      hideBackgroundDots: true,
    };
  }

  return opts;
}
