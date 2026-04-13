export type StylePreset = 'classic' | 'rounded' | 'branded';

export interface QRConfig {
  url: string;
  label: string;
  preset: StylePreset;
  fgColor: string;
  bgColor: string;
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
  fgColor: '#000000',
  bgColor: '#FFFFFF',
  size: 300,
  includeBorder: true,
  logoDataUrl: null,
};

export const DEMO_CONFIG: Partial<QRConfig> = {
  url: 'https://example.com/book',
  label: 'Scan to Book an Appointment',
};
