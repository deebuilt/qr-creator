import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sparkles, RotateCcw } from 'lucide-react';
import type { QRConfig } from '@/types/qr';
import { DEMO_CONFIG } from '@/types/qr';

interface Props {
  config: QRConfig;
  onChange: (updates: Partial<QRConfig>) => void;
  onReset: () => void;
}

function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

export function QRInputPanel({ config, onChange, onReset }: Props) {
  const hasContent = config.url || config.label;
  const urlError = config.url && !isValidUrl(config.url);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url">URL *</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://your-website.com"
          value={config.url}
          onChange={e => onChange({ url: e.target.value })}
          className={urlError ? 'border-destructive' : ''}
        />
        {urlError && (
          <p className="text-xs text-destructive">Please enter a valid URL</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="label">Label (optional)</Label>
        <Input
          id="label"
          placeholder="Scan to Book"
          value={config.label}
          maxLength={40}
          onChange={e => onChange({ label: e.target.value })}
        />
        <p className="text-xs text-muted-foreground text-right">{config.label.length}/40</p>
      </div>

      <div className="flex gap-2">
        {!hasContent && (
          <Button
            variant="outline"
            className="flex-1 min-h-[44px]"
            onClick={() => onChange(DEMO_CONFIG)}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Try Demo
          </Button>
        )}
        {hasContent && (
          <Button
            variant="ghost"
            className="flex-1 min-h-[44px]"
            onClick={onReset}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
