// Quick-start presets. These seed the granular fields below; after picking one
// the user can still fine-tune every dot/eye/color control independently.
export type StylePreset = 'classic' | 'rounded' | 'branded' | 'dots' | 'sharp';

// Body module shape (qr-code-styling `dotsOptions.type`).
export type DotStyle =
  | 'square'
  | 'rounded'
  | 'dots'
  | 'classy'
  | 'classy-rounded'
  | 'extra-rounded';

// The three finder ("eye") corners. Styling these separately from the body —
// especially giving them their own color — is the single biggest "designer QR"
// tell, and it stays perfectly scannable.
export type EyeStyle = 'square' | 'rounded' | 'extra-rounded' | 'dot';

export interface QRConfig {
  url: string;
  label: string;
  preset: StylePreset;
  // Body dots
  dotStyle: DotStyle;
  fgColor: string;
  bgColor: string;
  // Gradient (applied to the body dots when enabled)
  useGradient: boolean;
  gradientColor: string;
  gradientType: 'linear' | 'radial';
  // Finder eyes — own shape + optional own color (null = follow fgColor)
  eyeStyle: EyeStyle;
  eyeColor: string | null;
  // Layout
  size: number;
  includeBorder: boolean;
  logoDataUrl: string | null;
}

export interface SavedQRCode {
  id: string;
  config: QRConfig;
  createdAt: string;
}

export const DEFAULT_CONFIG: QRConfig = {
  url: '',
  label: '',
  preset: 'classic',
  dotStyle: 'square',
  fgColor: '#000000',
  bgColor: '#FFFFFF',
  useGradient: false,
  gradientColor: '#6366f1',
  gradientType: 'linear',
  eyeStyle: 'square',
  eyeColor: null,
  size: 300,
  includeBorder: true,
  logoDataUrl: null,
};

export const DEMO_CONFIG: Partial<QRConfig> = {
  url: 'https://example.com/book',
  label: 'Scan to Book an Appointment',
};

// Preset definitions — each seeds the granular fields. `label`/`desc` drive the
// quick-start picker; applying a preset overwrites the styling fields but leaves
// url/label/size/logo alone.
export interface PresetDef {
  value: StylePreset;
  label: string;
  desc: string;
  fields: Partial<QRConfig>;
}

export const PRESETS: PresetDef[] = [
  {
    value: 'classic',
    label: 'Classic',
    desc: 'Black & white, square',
    fields: {
      dotStyle: 'square',
      eyeStyle: 'square',
      eyeColor: null,
      fgColor: '#000000',
      bgColor: '#FFFFFF',
      useGradient: false,
    },
  },
  {
    value: 'rounded',
    label: 'Rounded',
    desc: 'Soft ink modules',
    fields: {
      dotStyle: 'rounded',
      eyeStyle: 'extra-rounded',
      eyeColor: null,
      fgColor: '#1a1a2e',
      bgColor: '#FFFFFF',
      useGradient: false,
    },
  },
  {
    value: 'branded',
    label: 'Branded',
    desc: 'Accent gradient',
    fields: {
      dotStyle: 'rounded',
      eyeStyle: 'extra-rounded',
      eyeColor: '#4338ca',
      fgColor: '#6366f1',
      bgColor: '#FFFFFF',
      useGradient: true,
      gradientColor: '#a855f7',
      gradientType: 'linear',
    },
  },
  {
    value: 'dots',
    label: 'Dots',
    desc: 'Circular, playful',
    fields: {
      dotStyle: 'dots',
      eyeStyle: 'dot',
      eyeColor: null,
      fgColor: '#0f766e',
      bgColor: '#FFFFFF',
      useGradient: false,
    },
  },
  {
    value: 'sharp',
    label: 'Sharp',
    desc: 'Classy, editorial',
    fields: {
      dotStyle: 'classy-rounded',
      eyeStyle: 'square',
      eyeColor: '#111827',
      fgColor: '#111827',
      bgColor: '#FFFFFF',
      useGradient: false,
    },
  },
];
