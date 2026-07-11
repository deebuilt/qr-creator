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
import { ImagePlus, X, AlertTriangle } from 'lucide-react';
import type { QRConfig, StylePreset, DotStyle, EyeStyle } from '@/types/qr';
import { PRESETS } from '@/types/qr';
import { isContrastSafe } from '@/lib/qr-options';

const DOT_STYLES: { value: DotStyle; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'dots', label: 'Dots' },
  { value: 'classy', label: 'Classy' },
  { value: 'classy-rounded', label: 'Classy soft' },
  { value: 'extra-rounded', label: 'Pill' },
];

const EYE_STYLES: { value: EyeStyle; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'extra-rounded', label: 'Soft' },
  { value: 'dot', label: 'Dot' },
];

interface Props {
  config: QRConfig;
  onChange: (updates: Partial<QRConfig>) => void;
}

// Small labelled color swatch + hex input, reused across fg / bg / eye / gradient.
function ColorField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 cursor-pointer rounded border border-input p-0.5"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono text-xs"
        />
      </div>
    </div>
  );
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
    const def = PRESETS.find((p) => p.value === preset);
    if (!def) return;
    onChange({ preset, ...def.fields });
  };

  const contrastOk = isContrastSafe(config.fgColor, config.bgColor);

  // A pick that changes the granular fields is now a custom look, not the preset.
  const setCustom = (updates: Partial<QRConfig>) => onChange(updates);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="customize" className="border-none">
        <AccordionTrigger className="text-sm font-medium min-h-[44px] py-2">
          Customize
        </AccordionTrigger>
        <AccordionContent className="space-y-5 pt-2">
          {/* Style Presets (quick-start) */}
          <div className="space-y-2">
            <Label>Style presets</Label>
            <div className="grid grid-cols-3 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => applyPreset(p.value)}
                  className={`rounded-xl border p-2.5 text-left text-xs transition-all min-h-[44px] active:scale-[0.97] ${
                    config.preset === p.value
                      ? 'border-primary bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.15)]'
                      : 'border-border/60 hover:border-primary/40'
                  }`}
                >
                  <div className="font-medium">{p.label}</div>
                  <div className="text-muted-foreground mt-0.5 leading-tight">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dot style */}
          <div className="space-y-2">
            <Label>Module shape</Label>
            <div className="grid grid-cols-3 gap-2">
              {DOT_STYLES.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setCustom({ dotStyle: d.value })}
                  className={`rounded-lg border px-2 py-2 text-xs transition-all min-h-[40px] active:scale-[0.97] ${
                    config.dotStyle === d.value
                      ? 'border-primary bg-primary/5 font-medium'
                      : 'border-border/60 hover:border-primary/40'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Eye style */}
          <div className="space-y-2">
            <Label>Corner eyes</Label>
            <div className="grid grid-cols-4 gap-2">
              {EYE_STYLES.map((e) => (
                <button
                  key={e.value}
                  onClick={() => setCustom({ eyeStyle: e.value })}
                  className={`rounded-lg border px-2 py-2 text-xs transition-all min-h-[40px] active:scale-[0.97] ${
                    config.eyeStyle === e.value
                      ? 'border-primary bg-primary/5 font-medium'
                      : 'border-border/60 hover:border-primary/40'
                  }`}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <ColorField
              id="fg"
              label="Foreground"
              value={config.fgColor}
              onChange={(v) => setCustom({ fgColor: v })}
            />
            <ColorField
              id="bg"
              label="Background"
              value={config.bgColor}
              onChange={(v) => setCustom({ bgColor: v })}
            />
          </div>

          {!contrastOk && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-2.5 text-xs text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Low contrast between foreground and background — scanners may
                struggle. Use a darker foreground on a lighter background.
              </span>
            </div>
          )}

          {/* Eye color */}
          <div className="flex items-center justify-between min-h-[44px]">
            <Label htmlFor="eyecolor" className="cursor-pointer">
              Separate eye color
            </Label>
            <Switch
              id="eyecolor"
              checked={config.eyeColor !== null}
              onCheckedChange={(v) =>
                setCustom({ eyeColor: v ? config.fgColor : null })
              }
            />
          </div>
          {config.eyeColor !== null && (
            <ColorField
              id="eye"
              label="Eye color"
              value={config.eyeColor}
              onChange={(v) => setCustom({ eyeColor: v })}
            />
          )}

          {/* Gradient */}
          <div className="flex items-center justify-between min-h-[44px]">
            <Label htmlFor="gradient" className="cursor-pointer">
              Gradient fill
            </Label>
            <Switch
              id="gradient"
              checked={config.useGradient}
              onCheckedChange={(v) => setCustom({ useGradient: v })}
            />
          </div>
          {config.useGradient && (
            <div className="space-y-3 rounded-lg border border-border/60 p-3">
              <ColorField
                id="grad"
                label="Gradient color (blends from foreground)"
                value={config.gradientColor}
                onChange={(v) => setCustom({ gradientColor: v })}
              />
              <div className="space-y-2">
                <Label>Direction</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(['linear', 'radial'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setCustom({ gradientType: t })}
                      className={`rounded-lg border px-2 py-2 text-xs capitalize transition-all min-h-[40px] active:scale-[0.97] ${
                        config.gradientType === t
                          ? 'border-primary bg-primary/5 font-medium'
                          : 'border-border/60 hover:border-primary/40'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

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
            <Label htmlFor="border" className="cursor-pointer">
              Include border (for printing)
            </Label>
            <Switch
              id="border"
              checked={config.includeBorder}
              onCheckedChange={(v) => onChange({ includeBorder: v })}
            />
          </div>

          {/* Logo */}
          <div className="space-y-2">
            <Label>Center logo</Label>
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
