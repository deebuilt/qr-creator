import { useEffect, useRef, useCallback } from 'react';
import QRCodeStyling from 'qr-code-styling';
import type { QRConfig } from '@/types/qr';
import { buildOptions } from '@/lib/qr-options';
import { QrCode, ScanLine } from 'lucide-react';

function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

interface Props {
  config: QRConfig;
}

export function QRPreview({ config }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Per-instance (not a module singleton) so the QR is always appended to THIS
  // component's live container — a module-level instance kept drawing into a
  // detached node after the layout remounted the preview.
  const qrRef = useRef<QRCodeStyling | null>(null);
  const validUrl = isValidUrl(config.url);

  useEffect(() => {
    if (!validUrl || !containerRef.current) return;

    const opts = buildOptions(config);

    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(opts);
      containerRef.current.innerHTML = '';
      qrRef.current.append(containerRef.current);
    } else {
      qrRef.current.update(opts);
    }
  }, [config, validUrl]);

  // If the URL becomes invalid we unmount the QR node below; drop the instance
  // so a later valid URL re-appends cleanly into the fresh container.
  useEffect(() => {
    if (!validUrl) qrRef.current = null;
  }, [validUrl]);

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
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-10 text-center min-h-[280px] w-full bg-muted/40">
        <QrCode className="h-10 w-10 text-muted-foreground/40 mb-3" />
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
