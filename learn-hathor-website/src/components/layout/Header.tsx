import { ExternalLink } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-bg-primary/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 text-text-primary font-bold text-lg"
        >
          <img
            src="/hathor-logo.svg"
            alt="Hathor Network"
            className="h-5 w-auto"
          />
          <span className="text-primary-400">Learning Hub</span>
        </a>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <a
            href="https://hathor.network"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
          >
            Hathor Network
            <ExternalLink size={14} />
          </a>
          <a
            href="https://docs.hathor.network"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
          >
            Docs
            <ExternalLink size={14} />
          </a>
          <a
            href="https://github.com/HathorNetwork"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
          >
            GitHub
            <ExternalLink size={14} />
          </a>
        </nav>
      </div>
    </header>
  );
}
