import QRCodeStyling from 'qr-code-styling';
import type { QRConfig } from '@/types/qr';
import { buildOptions, contrastRatio } from '@/lib/qr-options';

// Renders a branded "Scan me" card — the QR presented in a designed card with
// the label and a call-to-action, on a brand-colored panel. This is the
// gallery-worthy deliverable (a bare QR is a utility; a framed card is a
// product). Composited on a canvas so it's fully self-contained — no external
// libraries, sharp at 2x.

const SCALE = 2; // export at 2x for crisp print/retina
const CARD_W = 640;
const CARD_H = 820;

function readableInkOn(bg: string): string {
  // Pick black or white text for legibility on the chosen panel color.
  return contrastRatio('#ffffff', bg) >= contrastRatio('#111111', bg)
    ? '#ffffff'
    : '#111111';
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export interface CardOptions {
  /** Panel/accent color for the card. Defaults to the QR foreground. */
  panelColor?: string;
  /** Headline above the QR. Falls back to the config label or "Scan me". */
  heading?: string;
}

async function qrPngBlob(config: QRConfig): Promise<Blob> {
  // Render the QR on a white tile so it always reads inside the card, at high res.
  const opts = buildOptions({ ...config, bgColor: '#FFFFFF', includeBorder: true });
  opts.width = 720;
  opts.height = 720;
  const qr = new QRCodeStyling(opts);
  const blob = await qr.getRawData('png');
  return blob as Blob;
}

function loadImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

export async function renderQRCardBlob(
  config: QRConfig,
  options: CardOptions = {},
): Promise<Blob> {
  const panel = options.panelColor ?? config.fgColor;
  const heading = (options.heading ?? config.label ?? '').trim() || 'Scan me';
  const ink = readableInkOn(panel);
  const muted =
    ink === '#ffffff' ? 'rgba(255,255,255,0.72)' : 'rgba(17,17,17,0.60)';

  const canvas = document.createElement('canvas');
  canvas.width = CARD_W * SCALE;
  canvas.height = CARD_H * SCALE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D not supported');
  ctx.scale(SCALE, SCALE);

  // Panel background
  ctx.fillStyle = panel;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // Heading
  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.font = '700 44px system-ui, -apple-system, Segoe UI, sans-serif';
  ctx.fillText(heading, CARD_W / 2, 96, CARD_W - 80);

  // White QR tile
  const tile = 440;
  const tileX = (CARD_W - tile) / 2;
  const tileY = 150;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.18)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, tileX, tileY, tile, tile, 28);
  ctx.fill();
  ctx.restore();

  const qrImg = await loadImage(await qrPngBlob(config));
  const pad = 24;
  ctx.drawImage(qrImg, tileX + pad, tileY + pad, tile - pad * 2, tile - pad * 2);

  // "SCAN ME" pill with chevron under the QR
  const pillY = tileY + tile + 54;
  ctx.font = '700 22px system-ui, -apple-system, Segoe UI, sans-serif';
  const pillText = 'SCAN WITH YOUR CAMERA';
  const textW = ctx.measureText(pillText).width;
  const pillW = textW + 96;
  const pillH = 56;
  const pillX = (CARD_W - pillW) / 2;
  ctx.fillStyle = ink;
  roundRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
  ctx.fill();
  ctx.fillStyle = panel;
  ctx.textAlign = 'center';
  ctx.fillText(pillText, CARD_W / 2 + 12, pillY + 37);
  // chevron
  const cx = pillX + 34;
  const cy = pillY + pillH / 2;
  ctx.strokeStyle = panel;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 6, cy - 9);
  ctx.lineTo(cx + 6, cy);
  ctx.lineTo(cx - 6, cy + 9);
  ctx.stroke();

  // Footer wordmark
  ctx.fillStyle = muted;
  ctx.textAlign = 'center';
  ctx.font = '500 18px system-ui, -apple-system, Segoe UI, sans-serif';
  ctx.fillText('Made with Opsette', CARD_W / 2, CARD_H - 34);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
      'image/png',
    );
  });
}

export async function downloadQRCard(
  config: QRConfig,
  options?: CardOptions,
): Promise<void> {
  const blob = await renderQRCardBlob(config, options);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'qr-card.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
