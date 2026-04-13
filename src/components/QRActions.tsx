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
    <div className="flex flex-wrap gap-2">
      <Button disabled={disabled} onClick={handlePng} size="sm" className="flex-1 h-9 text-xs font-medium rounded-full">
        <Download className="mr-1.5 h-3.5 w-3.5" /> Download PNG
      </Button>
      <Button disabled={disabled} onClick={handleSvg} variant="outline" size="sm" className="flex-1 h-9 text-xs font-medium rounded-full">
        <Download className="mr-1.5 h-3.5 w-3.5" /> SVG
      </Button>
      <Button disabled={disabled} onClick={handleCopy} variant="outline" size="sm" className="flex-1 h-9 text-xs font-medium rounded-full">
        <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
      </Button>
      <Button disabled={disabled} onClick={handleSave} variant="secondary" size="sm" className="flex-1 h-9 text-xs font-medium rounded-full">
        <BookmarkPlus className="mr-1.5 h-3.5 w-3.5" /> Save
      </Button>
    </div>
  );
}
