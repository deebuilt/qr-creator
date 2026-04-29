import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRInputPanel } from '@/components/QRInputPanel';
import { QRCustomizePanel } from '@/components/QRCustomizePanel';
import { QRPreview } from '@/components/QRPreview';
import { QRActions } from '@/components/QRActions';
import { QRLibrary } from '@/components/QRLibrary';
import { useQRLibrary } from '@/hooks/useQRLibrary';
import { DEFAULT_CONFIG, type QRConfig } from '@/types/qr';
import { OpsetteHeader } from '@/components/opsette-header';
const CARD_SHADOW = '0 2px 6px -1px rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.04)';

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
      <OpsetteHeader />

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
