import { useNavigate } from 'react-router-dom';
import { OpsetteFooterLogo } from '@/components/opsette-share';

export default function About() {
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

        <h1 className="text-xl font-bold tracking-tight text-foreground mb-2">About QR Creator</h1>
        <p className="text-sm text-muted-foreground mb-6">
          A business tool from Opsette Marketplace.
        </p>

        <div className="space-y-5 text-sm text-foreground/80 leading-relaxed">
          <p>
            QR Creator helps you generate custom QR codes for URLs, Wi-Fi, contact info, text,
            and more — then customize the colors, add a logo, and download a shareable image.
          </p>

          <section>
            <h2 className="font-semibold text-foreground mb-1.5">How it works</h2>
            <ol className="space-y-1 pl-5 list-decimal">
              <li>Pick the type of QR code you want to create.</li>
              <li>Fill in the details — link, Wi-Fi credentials, contact info, etc.</li>
              <li>Customize colors, corner styles, and add a center logo if you'd like.</li>
              <li>Download as PNG or SVG, or save to your library for later.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-1.5">Your data stays local</h2>
            <p>Everything runs in your browser. Saved QR codes live in your browser's local storage — nothing is sent to any server.</p>
          </section>

        </div>

        <OpsetteFooterLogo />
      </main>
    </div>
  );
}
