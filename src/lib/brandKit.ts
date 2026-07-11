// ── Brand Kit interop (see opsette-tools.github.io/docs/BRAND-KIT-INTEROP-CONTRACT.md) ──
// QR Creator is the `qr` source in the shared clipboard contract. Brand Board
// consumes the QR as an uploaded image (SVG preferred), so QR needs no JSON on
// the *consume* side — but the same contract's "triple duty" gives each app a
// reopen-your-own-shape path so a client revision can bring the exact styled QR
// back weeks later. This file is that half: serialize the QRConfig to the shared
// envelope, and parse it back. Mechanism is copy-JSON → paste — no backend.

import { z } from 'zod';
import QRCodeStyling from 'qr-code-styling';
import { DEFAULT_CONFIG, type QRConfig } from '@/types/qr';
import { buildOptions } from '@/lib/qr-options';

export type QRPayload = {
  type: 'qr';
  v: 1;
  source: 'opsette';
  data: {
    // The QR settings — for reopen/recreate in QR Creator.
    config: QRConfig;
    // The rendered QR as a data URL (SVG). This is what lets ONE paste both
    // SHOW the QR on Brand Board and archive it — nothing is hosted, the image
    // travels inside the blob. Contract §4 (REVISED 2026-07-11).
    image: string;
    // Convenience: the encoded URL at top level.
    url?: string;
  };
};

// Render the current QR to an SVG data URL — vector, so it stays sharp on
// Brand Board's print-quality page. Uses the same buildOptions as the preview
// and downloads, at the config's chosen export size.
async function renderImageDataUrl(config: QRConfig): Promise<string> {
  const opts = buildOptions(config);
  opts.type = 'svg';
  opts.width = config.size;
  opts.height = config.size;
  const qr = new QRCodeStyling(opts);
  const blob = (await qr.getRawData('svg')) as Blob;
  const svgText = await blob.text();
  // Encode as a UTF-8-safe data URL (btoa chokes on non-latin1 SVG content).
  const encoded = encodeURIComponent(svgText);
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

// Serialize the current QR into the shared Brand Kit shape, embedding the
// rendered image so Brand Board needs no separate upload. Async because it
// renders the QR to a data URL.
export async function toKitJson(config: QRConfig): Promise<QRPayload> {
  const image = await renderImageDataUrl(config);
  return {
    type: 'qr',
    v: 1,
    source: 'opsette',
    data: {
      config: { ...config },
      image,
      url: config.url || undefined,
    },
  };
}

// The reopen path only needs to restore a valid QRConfig. We validate the
// envelope strictly, but keep the inner config tolerant (partial → merged onto
// DEFAULT_CONFIG) so an older/leaner blob still reopens cleanly.
const configSchema = z
  .object({
    url: z.string().optional(),
    label: z.string().optional(),
    preset: z.string().optional(),
    dotStyle: z.string().optional(),
    fgColor: z.string().optional(),
    bgColor: z.string().optional(),
    useGradient: z.boolean().optional(),
    gradientColor: z.string().optional(),
    gradientType: z.string().optional(),
    eyeStyle: z.string().optional(),
    eyeColor: z.string().nullable().optional(),
    size: z.number().optional(),
    includeBorder: z.boolean().optional(),
    logoDataUrl: z.string().nullable().optional(),
  })
  .passthrough();

const payloadSchema = z.object({
  type: z.literal('qr'),
  v: z.literal(1),
  source: z.literal('opsette'),
  data: z
    .object({
      config: configSchema,
      // Present on blobs exported after the image add — ignored on reopen (the
      // QR is rebuilt from config), so just tolerate it.
      image: z.string().optional(),
      url: z.string().optional(),
    })
    .passthrough(),
});

// Parse a pasted blob back into a reopenable QRConfig. Returns null (never
// throws) for anything that isn't a valid Opsette QR blob. Merges onto
// DEFAULT_CONFIG so every field is present and typed after reopen.
export function fromKitJson(raw: string): QRConfig | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw.trim());
  } catch {
    return null;
  }
  const result = payloadSchema.safeParse(parsed);
  if (!result.success) return null;

  return { ...DEFAULT_CONFIG, ...(result.data.data.config as Partial<QRConfig>) };
}
