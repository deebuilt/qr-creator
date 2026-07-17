import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';

/**
 * EmbedSaveBar — the slim top bar shown ONLY when QR Creator runs inside a Brand
 * Board iframe (Mechanism 3, ?embed=1). It replaces the app's own header so the
 * drawer reads as one surface, and pushes the revised QR back to the board on
 * Save. Closing the drawer is the parent's job.
 *
 * QR Creator is shadcn/Tailwind (not Ant), so this bar uses the shadcn Button +
 * lucide icons — no Ant components.
 */
export function EmbedSaveBar({
  onSave,
  saving,
}: {
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div
      className="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 py-2.5"
      style={{ background: '#2f4f46', color: '#fff' }}
    >
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold text-white">Editing your QR code</span>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.72)' }}>
          Changes stay here until you send them back to the board.
        </span>
      </div>
      <Button
        onClick={onSave}
        disabled={saving}
        className="shrink-0 border-white bg-white text-[#2f4f46] hover:bg-white/90"
      >
        {saving ? (
          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
        ) : (
          <Check className="mr-1.5 h-4 w-4" />
        )}
        Save to Brand Board
      </Button>
    </div>
  );
}
