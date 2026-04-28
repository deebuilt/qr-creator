import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRInputPanel } from '@/components/QRInputPanel';
import { QRCustomizePanel } from '@/components/QRCustomizePanel';
import { QRPreview } from '@/components/QRPreview';
import { QRActions } from '@/components/QRActions';
import { QRLibrary } from '@/components/QRLibrary';
import { useQRLibrary } from '@/hooks/useQRLibrary';
import { DEFAULT_CONFIG, type QRConfig } from '@/types/qr';
import { ShareAppButton } from '@/components/opsette-share';
const CARD_SHADOW = '0 2px 6px -1px rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.04)';

function AppLogo({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
      <rect width="512" height="512" rx="96" fill="#1a1a2e"/>
      <rect x="56" y="56" width="140" height="140" rx="20" fill="none" stroke="#fff" strokeWidth="28"/>
      <rect x="96" y="96" width="60" height="60" rx="10" fill="#fff"/>
      <rect x="316" y="56" width="140" height="140" rx="20" fill="none" stroke="#fff" strokeWidth="28"/>
      <rect x="356" y="96" width="60" height="60" rx="10" fill="#fff"/>
      <rect x="56" y="316" width="140" height="140" rx="20" fill="none" stroke="#fff" strokeWidth="28"/>
      <rect x="96" y="356" width="60" height="60" rx="10" fill="#fff"/>
      <rect x="236" y="76" width="40" height="40" rx="8" fill="#fff"/>
      <rect x="236" y="236" width="40" height="40" rx="8" fill="#818cf8"/>
      <rect x="316" y="236" width="40" height="40" rx="8" fill="#fff"/>
      <rect x="236" y="316" width="40" height="40" rx="8" fill="#fff"/>
      <rect x="316" y="316" width="40" height="40" rx="8" fill="#818cf8"/>
      <rect x="396" y="396" width="40" height="40" rx="8" fill="#fff"/>
      <rect x="316" y="396" width="40" height="40" rx="8" fill="#818cf8"/>
      <rect x="396" y="316" width="40" height="40" rx="8" fill="#fff"/>
    </svg>
  );
}

export default function Index() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<QRConfig>({ ...DEFAULT_CONFIG });
  const { library, saveConfig, deleteEntry } = useQRLibrary();

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
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
        <div className="mx-auto flex h-12 max-w-lg items-center justify-between gap-2.5 px-4">
          <div className="flex items-center gap-2.5">
            <AppLogo className="h-7 w-7 rounded-md" />
            <h1 className="text-base font-semibold text-foreground">QR Creator</h1>
          </div>
          <ShareAppButton size={36} />
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-3 px-4 py-4 pb-8">
        {/* Input Section */}
        <div
          className="bg-card rounded-xl p-4 border border-border/60"
          style={{ boxShadow: CARD_SHADOW }}
        >
          <div className="space-y-3">
            <QRInputPanel config={config} onChange={handleChange} onReset={handleReset} />
            <QRCustomizePanel config={config} onChange={handleChange} />
          </div>
        </div>

        {/* Preview */}
        <div
          className="bg-card rounded-xl p-6 border border-border/60 overflow-hidden"
          style={{ boxShadow: CARD_SHADOW }}
        >
          <div className="flex flex-col items-center">
            <QRPreview config={config} />
          </div>
        </div>

        {/* Actions */}
        <QRActions config={config} onSave={() => saveConfig(config)} />

        {/* Library */}
        <QRLibrary library={library} onLoad={handleLoad} onDelete={deleteEntry} />

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
      </main>
    </div>
  );
}
