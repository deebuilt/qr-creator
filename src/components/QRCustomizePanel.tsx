import { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ImagePlus, X } from 'lucide-react';
import type { QRConfig, StylePreset } from '@/types/qr';

const PRESETS: { value: StylePreset; label: string; desc: string }[] = [
  { value: 'classic', label: 'Classic', desc: 'Black & white, square' },
  { value: 'rounded', label: 'Rounded', desc: 'Dark, rounded modules' },
  { value: 'branded', label: 'Branded', desc: 'Accent color, gradient' },
];

interface Props {
  config: QRConfig;
  onChange: (updates: Partial<QRConfig>) => void;
}

export function QRCustomizePanel({ config, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ logoDataUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  const applyPreset = (preset: StylePreset) => {
    const updates: Partial<QRConfig> = { preset };
    if (preset === 'classic') {
      updates.fgColor = '#000000';
      updates.bgColor = '#FFFFFF';
    } else if (preset === 'rounded') {
      updates.fgColor = '#1a1a2e';
      updates.bgColor = '#FFFFFF';
    } else if (preset === 'branded') {
      updates.fgColor = '#6366f1';
      updates.bgColor = '#FFFFFF';
    }
    onChange(updates);
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="customize" className="border-none">
        <AccordionTrigger className="text-sm font-medium min-h-[44px] py-2">
          Customize
        </AccordionTrigger>
        <AccordionContent className="space-y-5 pt-2">
          {/* Style Presets */}
          <div className="space-y-2">
            <Label>Style</Label>
            <div className="grid grid-cols-3 gap-2">
              {PRESETS.map(p => (
                <button
                  key={p.value}
                  onClick={() => applyPreset(p.value)}
                  className={`rounded-lg border p-3 text-left text-xs transition-colors min-h-[44px] ${
                    config.preset === p.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium">{p.label}</div>
                  <div className="text-muted-foreground mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fg">Foreground</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="fg"
                  value={config.fgColor}
                  onChange={e => onChange({ fgColor: e.target.value })}
                  className="h-9 w-9 cursor-pointer rounded border border-input p-0.5"
                />
                <Input
                  value={config.fgColor}
                  onChange={e => onChange({ fgColor: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bg">Background</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="bg"
                  value={config.bgColor}
                  onChange={e => onChange({ bgColor: e.target.value })}
                  className="h-9 w-9 cursor-pointer rounded border border-input p-0.5"
                />
                <Input
                  value={config.bgColor}
                  onChange={e => onChange({ bgColor: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Size */}
          <div className="space-y-2">
            <Label>Size: {config.size}px</Label>
            <Slider
              value={[config.size]}
              min={200}
              max={600}
              step={10}
              onValueChange={([v]) => onChange({ size: v })}
              className="min-h-[44px] flex items-center"
            />
          </div>

          {/* Border */}
          <div className="flex items-center justify-between min-h-[44px]">
            <Label htmlFor="border" className="cursor-pointer">Include border (for printing)</Label>
            <Switch
              id="border"
              checked={config.includeBorder}
              onCheckedChange={v => onChange({ includeBorder: v })}
            />
          </div>

          {/* Logo */}
          <div className="space-y-2">
            <Label>Logo overlay</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
            {config.logoDataUrl ? (
              <div className="flex items-center gap-3">
                <img
                  src={config.logoDataUrl}
                  alt="Logo"
                  className="h-10 w-10 rounded border object-contain"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="min-h-[44px]"
                  onClick={() => onChange({ logoDataUrl: null })}
                >
                  <X className="mr-1 h-4 w-4" /> Remove
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full min-h-[44px]"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="mr-2 h-4 w-4" /> Upload Logo
              </Button>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
