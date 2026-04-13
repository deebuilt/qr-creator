import { useEffect, useRef, useCallback } from 'react';
import QRCodeStyling, {
  type Options,
  type DotType,
} from 'qr-code-styling';
import type { QRConfig } from '@/types/qr';
import { QrCode, ScanLine } from 'lucide-react';

function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

function buildOptions(config: QRConfig): Options {
  const dotType: DotType =
    config.preset === 'classic' ? 'square' : 'rounded';

  const opts: Options = {
    width: 280,
    height: 280,
    data: config.url || 'https://placeholder.test',
    dotsOptions: {
      color: config.fgColor,
      type: dotType,
    },
    backgroundOptions: {
      color: config.bgColor,
    },
    cornersSquareOptions: {
      type: config.preset === 'classic' ? 'square' : 'extra-rounded',
    },
    cornersDotOptions: {
      type: config.preset === 'classic' ? 'square' : 'dot',
    },
    qrOptions: {
      errorCorrectionLevel: 'H',
    },
    margin: config.includeBorder ? 16 : 0,
  };

  if (config.preset === 'branded') {
    opts.dotsOptions = {
      type: 'rounded',
      gradient: {
        type: 'linear',
        rotation: Math.PI / 4,
        colorStops: [
          { offset: 0, color: config.fgColor },
          { offset: 1, color: adjustBrightness(config.fgColor, 40) },
        ],
      },
    };
  }

  if (config.logoDataUrl) {
    opts.image = config.logoDataUrl;
    opts.imageOptions = {
      crossOrigin: 'anonymous',
      margin: 4,
      imageSize: 0.3,
    };
  }

  return opts;
}

function adjustBrightness(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

interface Props {
  config: QRConfig;
}

let qrInstance: QRCodeStyling | null = null;

export function QRPreview({ config }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const validUrl = isValidUrl(config.url);

  useEffect(() => {
    if (!validUrl || !containerRef.current) return;

    const opts = buildOptions(config);

    if (!qrInstance) {
      qrInstance = new QRCodeStyling(opts);
      containerRef.current.innerHTML = '';
      qrInstance.append(containerRef.current);
    } else {
      qrInstance.update(opts);
    }
  }, [config, validUrl]);

  const getDownloadInstance = useCallback(() => {
    const opts = buildOptions(config);
    opts.width = config.size;
    opts.height = config.size;
    return new QRCodeStyling(opts);
  }, [config]);

  useEffect(() => {
    (window as any).__qrDownload = {
      png: async () => {
        const qr = getDownloadInstance();
        await qr.download({ extension: 'png', name: 'qr-code' });
      },
      svg: async () => {
        const qr = getDownloadInstance();
        await qr.download({ extension: 'svg', name: 'qr-code' });
      },
      blob: async (): Promise<Blob> => {
        const qr = getDownloadInstance();
        const blob = await qr.getRawData('png');
        return blob as Blob;
      },
    };
    return () => {
      delete (window as any).__qrDownload;
    };
  }, [getDownloadInstance]);

  if (!validUrl) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-10 text-center min-h-[280px]">
        <QrCode className="h-12 w-12 text-muted-foreground/40 mb-3" />
        <p className="text-sm text-muted-foreground">
          Enter a URL to generate your QR code
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={containerRef}
        className="flex items-center justify-center rounded-xl"
        style={{ backgroundColor: config.bgColor }}
      />
      {config.label && (
        <p className="text-sm font-medium text-foreground text-center max-w-[280px]">
          {config.label}
        </p>
      )}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ScanLine className="h-3.5 w-3.5" />
        <span>Test with your phone camera before printing</span>
      </div>
    </div>
  );
}
