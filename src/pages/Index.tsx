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
    <div className="min-h-screen bg-background shadow-lg">
...
        {/* Preview */}
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center py-8 shadow-xl">
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
