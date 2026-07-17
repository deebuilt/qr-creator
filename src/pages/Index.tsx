import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRInputPanel } from '@/components/QRInputPanel';
import { QRCustomizePanel } from '@/components/QRCustomizePanel';
import { QRPreview } from '@/components/QRPreview';
import { QRActions } from '@/components/QRActions';
import { QRLibrary } from '@/components/QRLibrary';
import { QRReopenModal } from '@/components/QRReopenModal';
import { EmbedSaveBar } from '@/components/EmbedSaveBar';
import { Button } from '@/components/ui/button';
import { FolderOpen } from 'lucide-react';
import { useQRLibrary } from '@/hooks/useQRLibrary';
import { toast } from '@/hooks/use-toast';
import { DEFAULT_CONFIG, type QRConfig } from '@/types/qr';
import { OpsetteHeader } from '@/components/opsette-header';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { readSeedFromUrl, clearLinkParams } from '@/lib/opsette-kit-link';
import {
  isEmbedded,
  isTrustedEmbedMessage,
  embedSave,
  OPSETTE_TOOLS_ORIGIN,
} from '@/lib/opsette-kit-link';
import { fromKitJson, toKitJson } from '@/lib/brandKit';
import { initialConfigFromSeed } from '@/lib/seed';
const CARD_SHADOW = '0 2px 6px -1px rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.04)';

export default function Index() {
  const navigate = useNavigate();
  // Lazy init so a ?seed= brand core (Mechanism 1) is applied on the very first
  // render — the QR opens already in the client's brand color, no flash of the
  // black-on-white default. No seed → plain DEFAULT_CONFIG, unchanged.
  const [config, setConfig] = useState<QRConfig>(() =>
    initialConfigFromSeed(readSeedFromUrl()),
  );

  // ── Mechanism 3: running inside a Brand Board iframe ──────────────────────
  // Capture embed mode NOW (mount), before the effect below strips ?embed= from
  // the URL via clearLinkParams — otherwise isEmbedded() would read false later.
  const embedded = useMemo(() => isEmbedded(), []);
  const trustedParentOrigins = useMemo(
    () => (import.meta.env.DEV ? [window.location.origin, 'http://localhost:8124'] : []),
    [],
  );
  const [saving, setSaving] = useState(false);

  // Strip the seed param from the address bar after it's consumed, so a refresh
  // or a shared URL doesn't re-seed over work in progress.
  useEffect(() => {
    clearLinkParams();
  }, []);
  const [reopenOpen, setReopenOpen] = useState(false);
  const { library, saveConfig, deleteEntry } = useQRLibrary();

  // Inbound: the parent hands us the current QR blob to revise (or null = fresh).
  // Reuse the exact reopen parser the reopen modal uses. Origin-checked.
  useEffect(() => {
    if (!embedded) return;
    const onMessage = (event: MessageEvent) => {
      if (!isTrustedEmbedMessage(event, trustedParentOrigins)) return;
      if (event.data.kind === 'load' && typeof event.data.payload === 'string') {
        const loaded = fromKitJson(event.data.payload);
        if (loaded) setConfig({ ...loaded });
      }
    };
    window.addEventListener('message', onMessage);
    window.parent.postMessage({ source: 'opsette-embed', kind: 'ready' }, '*');
    return () => window.removeEventListener('message', onMessage);
  }, [embedded, trustedParentOrigins]);

  // Outbound: build the same blob "Export to Brand Board" produces (async — it
  // renders the QR into the blob) and post it up.
  const saveToBrandBoard = async () => {
    setSaving(true);
    try {
      const payload = await toKitJson(config);
      const targetOrigin = import.meta.env.DEV ? '*' : OPSETTE_TOOLS_ORIGIN;
      window.parent.postMessage(embedSave(JSON.stringify(payload)), targetOrigin);
      toast({ title: 'Updated in Brand Board' });
    } catch {
      toast({ title: "Couldn't send the QR back — try again.", variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = useCallback((updates: Partial<QRConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const handleReset = useCallback(() => {
    setConfig({ ...DEFAULT_CONFIG });
  }, []);

  const handleLoad = useCallback((loaded: QRConfig) => {
    setConfig({ ...loaded });
  }, []);

  return (
    <div className="min-h-[100dvh] bg-background">
      {embedded ? (
        <EmbedSaveBar onSave={() => void saveToBrandBoard()} saving={saving} />
      ) : (
        <OpsetteHeader rightExtra={<ThemeToggleButton />} />
      )}

      <main className="mx-auto max-w-4xl px-4 py-4 pb-8">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:items-start">
          {/* Controls — left on desktop, second on mobile */}
          <div
            className="order-2 lg:order-none bg-card rounded-xl p-4 border border-border/60"
            style={{ boxShadow: CARD_SHADOW }}
          >
            <div className="space-y-3">
              <QRInputPanel config={config} onChange={handleChange} onReset={handleReset} />
              <QRCustomizePanel config={config} onChange={handleChange} />
            </div>
          </div>

          {/* Preview + actions — right on desktop (sticky), first on mobile */}
          <div className="order-1 lg:order-none space-y-3 lg:sticky lg:top-4">
            <div
              className="bg-card rounded-xl p-6 border border-border/60 overflow-hidden"
              style={{ boxShadow: CARD_SHADOW }}
            >
              <div className="flex flex-col items-center">
                <QRPreview config={config} />
              </div>
            </div>

            <QRActions config={config} onSave={() => saveConfig(config)} />

            {!embedded && (
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setReopenOpen(true)}
                >
                  <FolderOpen className="mr-1.5 h-3.5 w-3.5" /> Reopen a saved QR
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Library — full width below both columns. Hidden when embedded (the
            board is the library in that context). */}
        {!embedded && (
          <div className="mt-3">
            <QRLibrary library={library} onLoad={handleLoad} onDelete={deleteEntry} />
          </div>
        )}

        <QRReopenModal
          open={reopenOpen}
          onOpenChange={setReopenOpen}
          onReopen={handleLoad}
        />

        {!embedded && (
        <footer className="flex items-center justify-center gap-1.5 py-3">
          <button onClick={() => navigate('/about')} className="text-xs text-muted-foreground hover:text-foreground transition-colors">About</button>
          <span className="text-muted-foreground/40">·</span>
          <button onClick={() => navigate('/privacy')} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</button>
          <span className="text-muted-foreground/40">·</span>
          <span className="text-xs text-muted-foreground">
            By{' '}
            <a href="https://opsette.io" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">
              Opsette
            </a>
          </span>
        </footer>
        )}
      </main>
    </div>
  );
}
