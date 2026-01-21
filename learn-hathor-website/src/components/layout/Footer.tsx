export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-bg-secondary py-6">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-sm text-text-muted">
          Powered by{' '}
          <a
            href="https://hathor.network"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-primary-400 transition-colors"
          >
            Hathor Network
          </a>
          {' • '}
          <a
            href="https://github.com/HathorNetwork"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-primary-400 transition-colors"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
