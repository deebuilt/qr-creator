// QR Creator's adapter for the shared brand-core seed (Mechanism 1 of
// docs/KIT-SUITE-CONNECT-PLAN.md). Maps a generic BrandCore — the four facts
// that ride in a ?seed= URL — onto QR Creator's QRConfig, so a QR opens in the
// client's brand color instead of plain black-on-white. Additive: no seed =
// today's behavior. Kept out of the vendored module (which stays tool-agnostic).
import type { BrandCore } from './opsette-kit-link';
import { DEFAULT_CONFIG, type QRConfig } from '@/types/qr';

// Normalize a seed hex to the "#RRGGBB" the QR renderer expects.
function normalizeHex(hex: string): string | null {
  let h = hex.trim();
  if (!h) return null;
  if (!h.startsWith('#')) h = `#${h}`;
  if (/^#[0-9a-fA-F]{3}$/.test(h)) {
    h = `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`;
  }
  return /^#[0-9a-fA-F]{6}$/.test(h) ? h.toUpperCase() : null;
}

function pick(core: BrandCore, ...roles: string[]): string | null {
  const colors = core.colors ?? [];
  const match = colors.find((c) => c.role && roles.includes(c.role));
  return match ? normalizeHex(match.hex) : null;
}

/**
 * Map a decoded brand core onto a partial QRConfig. The primary/first color
 * becomes the QR's foreground (dark modules); a color explicitly tagged
 * "background" becomes the background. A brand logo (when the seed carries a
 * small one) seeds the center logo. Returns null when the seed has nothing QR
 * can use, so the caller keeps DEFAULT_CONFIG.
 */
export function seedToConfig(core: BrandCore): Partial<QRConfig> | null {
  const colors = core.colors ?? [];
  const fg = pick(core, 'primary', 'base') ?? (colors[0] ? normalizeHex(colors[0].hex) : null);
  const bg = pick(core, 'background', 'surface');
  const patch: Partial<QRConfig> = {};
  if (fg) patch.fgColor = fg;
  if (bg) patch.bgColor = bg;
  // The brand name makes a natural default QR label ("Scan for <name>").
  if (core.name) patch.label = core.name;
  // Only a small inlined logo rides in the seed; use it as the center logo.
  if (core.logo && core.logo.startsWith('data:')) patch.logoDataUrl = core.logo;
  return Object.keys(patch).length > 0 ? patch : null;
}

/** Build the initial QRConfig for the page: DEFAULT_CONFIG, patched by any seed. */
export function initialConfigFromSeed(core: BrandCore | null): QRConfig {
  const patch = core ? seedToConfig(core) : null;
  return patch ? { ...DEFAULT_CONFIG, ...patch } : { ...DEFAULT_CONFIG };
}
