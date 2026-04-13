import type { QRConfig, SavedQRCode } from '@/types/qr';
import { Button } from '@/components/ui/button';
import { Trash2, ExternalLink } from 'lucide-react';

interface Props {
  library: SavedQRCode[];
  onLoad: (config: QRConfig) => void;
  onDelete: (id: string) => void;
}

export function QRLibrary({ library, onLoad, onDelete }: Props) {
  if (library.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground">Saved QR Codes</h2>
      <div className="space-y-2">
        {library.map(entry => (
          <div
            key={entry.id}
            className="flex items-center gap-3 rounded-lg border bg-card p-3"
          >
            <button
              className="flex-1 text-left min-h-[44px] flex flex-col justify-center"
              onClick={() => onLoad(entry.config)}
            >
              <span className="text-sm font-medium truncate block max-w-[220px]">
                {entry.config.label || entry.config.url}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                <span className="truncate max-w-[200px]">{entry.config.url}</span>
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(entry.createdAt).toLocaleDateString()}
              </span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="min-h-[44px] min-w-[44px] text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(entry.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
