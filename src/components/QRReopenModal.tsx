import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';
import { fromKitJson } from '@/lib/brandKit';
import type { QRConfig } from '@/types/qr';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReopen: (config: QRConfig) => void;
}

/**
 * Paste-to-reopen for QR Creator's own Brand Kit export shape (the `type:"qr"`
 * blob from "Export to Brand Board"). Second half of the interop contract's
 * "triple duty": the same JSON that archives with a client's kit pastes back
 * here to revise the exact styled QR weeks later, with no backend.
 * See docs/BRAND-KIT-INTEROP-CONTRACT.md.
 */
export function QRReopenModal({ open, onOpenChange, onReopen }: Props) {
  const [raw, setRaw] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (open) {
      setRaw('');
      setError(false);
    }
  }, [open]);

  const handleReopen = () => {
    const config = fromKitJson(raw);
    if (!config) {
      setError(true);
      return;
    }
    onReopen(config);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reopen a saved QR code</DialogTitle>
          <DialogDescription>
            Paste the JSON from an <strong>Export to Brand Board</strong> to bring
            a styled QR code back in and tweak it.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          rows={6}
          placeholder='{"type":"qr","v":1,"source":"opsette",…}'
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value);
            if (error) setError(false);
          }}
          className="font-mono text-xs"
        />

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-2.5 text-xs text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              That doesn't look like a QR Creator export. Copy the JSON from the
              Export to Brand Board button and paste the whole thing.
            </span>
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleReopen} disabled={!raw.trim()}>
            Reopen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
