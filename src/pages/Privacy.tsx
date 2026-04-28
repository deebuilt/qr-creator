import { useNavigate } from 'react-router-dom';
import { OpsetteFooterLogo } from '@/components/opsette-share';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-background">
      <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
        <div className="mx-auto flex h-12 max-w-lg items-center gap-2.5 px-4">
          <button onClick={() => navigate('/')} className="text-base font-semibold text-foreground hover:opacity-70 transition-opacity">
            QR Creator
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 pb-8">
        <button onClick={() => navigate('/')} className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-4">
          <span className="mr-1">&larr;</span> Back
        </button>

        <h1 className="text-xl font-bold tracking-tight text-foreground mb-4">Privacy</h1>

        <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
          <p>
            <strong>No personal data is collected.</strong> QR Creator does not require an account,
            login, or any personal information to use.
          </p>
          <p>
            <strong>Everything stays on your device.</strong> Your saved QR codes and preferences
            are stored locally in your browser using localStorage. Nothing is sent to any server.
          </p>
          <p>
            <strong>No tracking or analytics.</strong> No cookies, no analytics, no third-party tracking.
          </p>
          <p>
            <strong>No data is sold or shared.</strong> Since we don't collect any data, there is
            nothing to sell or share.
          </p>

        </div>

        <OpsetteFooterLogo />
      </main>
    </div>
  );
}
