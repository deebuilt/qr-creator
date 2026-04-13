import { Button } from '@/components/ui/button';
import { Download, Copy, BookmarkPlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { QRConfig } from '@/types/qr';

function isValidUrl(str: string): boolean {
  try { new URL(str); return true; } catch { return false; }
}

interface Props {
  config: QRConfig;
  onSave: () => void;
}

export function QRActions({ config, onSave }: Props) {
  const disabled = !isValidUrl(config.url);

  const handlePng = async () => {
    await (window as any).__qrDownload?.png();
    toast({ title: 'PNG downloaded!' });
  };

  const handleSvg = async () => {
    await (window as any).__qrDownload?.svg();
    toast({ title: 'SVG downloaded!' });
  };

  const handleCopy = async () => {
    try {
      const blob = await (window as any).__qrDownload?.blob();
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        toast({ title: 'Copied to clipboard!' });
      }
    } catch {
      toast({ title: 'Copy failed', description: 'Your browser may not support this.', variant: 'destructive' });
    }
  };

  const handleSave = () => {
    onSave();
    toast({ title: 'Saved to library!' });
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button disabled={disabled} onClick={handlePng} className="min-h-[44px]">
        <Download className="mr-2 h-4 w-4" /> PNG
      </Button>
      <Button disabled={disabled} onClick={handleSvg} variant="outline" className="min-h-[44px]">
        <Download className="mr-2 h-4 w-4" /> SVG
      </Button>
      <Button disabled={disabled} onClick={handleCopy} variant="outline" className="min-h-[44px]">
        <Copy className="mr-2 h-4 w-4" /> Copy
      </Button>
      <Button disabled={disabled} onClick={handleSave} variant="secondary" className="min-h-[44px]">
        <BookmarkPlus className="mr-2 h-4 w-4" /> Save
      </Button>
    </div>
  );
}
