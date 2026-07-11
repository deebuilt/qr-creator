import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Download,
  Copy,
  BookmarkPlus,
  Share2,
  ChevronDown,
  Image,
  FileImage,
  IdCard,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { QRConfig } from '@/types/qr';
import { toKitJson } from '@/lib/brandKit';
import { downloadQRCard } from '@/lib/qr-card';

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
  onSave: () => void;
}

export function QRActions({ config, onSave }: Props) {
  const disabled = !isValidUrl(config.url);

  const handlePng = async () => {
    await (window as any).__qrDownload?.png();
    toast({ title: 'PNG downloaded' });
  };

  const handleSvg = async () => {
    await (window as any).__qrDownload?.svg();
    toast({ title: 'SVG downloaded' });
  };

  const handleCard = async () => {
    try {
      await downloadQRCard(config);
      toast({ title: 'Scan card downloaded' });
    } catch {
      toast({ title: 'Card export failed', variant: 'destructive' });
    }
  };

  const handleCopy = async () => {
    try {
      const blob = await (window as any).__qrDownload?.blob();
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        toast({ title: 'Copied to clipboard' });
      }
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Your browser may not support this.',
        variant: 'destructive',
      });
    }
  };

  const handleExport = async () => {
    try {
      const payload = await toKitJson(config);
      await navigator.clipboard.writeText(JSON.stringify(payload));
      toast({
        title: 'Copied for Brand Board',
        description: 'Paste it into Brand Board, or back here to reopen later.',
      });
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  };

  const handleSave = () => {
    onSave();
    toast({ title: 'Saved to library' });
  };

  const btn =
    'h-10 text-xs font-medium rounded-xl active:scale-[0.97] transition-all';

  return (
    <div className="rounded-xl border border-border/60 bg-card p-2 shadow-sm space-y-2">
      {/* Primary row: Download (formats) + Export to Brand Board */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={disabled} size="sm" className={`${btn} flex-1`}>
              <Download className="mr-1.5 h-3.5 w-3.5" /> Download
              <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuItem onClick={handlePng}>
              <Image className="mr-2 h-4 w-4" /> PNG image
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSvg}>
              <FileImage className="mr-2 h-4 w-4" /> SVG (vector)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCard}>
              <IdCard className="mr-2 h-4 w-4" /> Branded scan card
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          disabled={disabled}
          onClick={handleExport}
          variant="secondary"
          size="sm"
          className={`${btn} flex-1`}
        >
          <Share2 className="mr-1.5 h-3.5 w-3.5" /> Export to Brand Board
        </Button>
      </div>

      {/* Secondary row: Copy + Save */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          disabled={disabled}
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className={btn}
        >
          <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
        </Button>
        <Button
          disabled={disabled}
          onClick={handleSave}
          variant="outline"
          size="sm"
          className={btn}
        >
          <BookmarkPlus className="mr-1.5 h-3.5 w-3.5" /> Save
        </Button>
      </div>
    </div>
  );
}
