import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { QRInputPanel } from '@/components/QRInputPanel';
import { QRCustomizePanel } from '@/components/QRCustomizePanel';
import { QRPreview } from '@/components/QRPreview';
import { QRActions } from '@/components/QRActions';
import { QRLibrary } from '@/components/QRLibrary';
import { useQRLibrary } from '@/hooks/useQRLibrary';
import { DEFAULT_CONFIG, type QRConfig } from '@/types/qr';
import { QrCode } from 'lucide-react';

export default function Index() {
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-lg items-center gap-2 px-4">
          <QrCode className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">QR Generator</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-4 px-4 py-5">
        {/* Input Section */}
        <Card>
          <CardContent className="pt-5 space-y-3">
            <QRInputPanel config={config} onChange={handleChange} onReset={handleReset} />
            <QRCustomizePanel config={config} onChange={handleChange} />
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardContent className="flex flex-col items-center py-8">
            <QRPreview config={config} />
          </CardContent>
        </Card>

        {/* Actions */}
        <QRActions config={config} onSave={() => saveConfig(config)} />

        {/* Library */}
        <QRLibrary library={library} onLoad={handleLoad} onDelete={deleteEntry} />
      </main>
    </div>
  );
}
