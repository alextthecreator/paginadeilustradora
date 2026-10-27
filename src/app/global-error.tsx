'use client';

// This boundary replaces the root layout, so it cannot depend on Providers,
// shared CSS, animations, or the client router being usable after a DOM error.
export default function GlobalError() {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0f2e1f', color: '#FBEAD5', fontFamily: 'system-ui, sans-serif' }}>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', boxSizing: 'border-box' }}>
          <div style={{ maxWidth: '560px', textAlign: 'center' }}>
            <h1 style={{ color: '#FF8A9D' }}>Something went wrong</h1>
            <p>Please reload the page to continue browsing Toska CR.</p>
            <button type="button" onClick={() => window.location.reload()} style={{ minHeight: '44px', padding: '12px 24px', background: '#FF8A9D', color: '#0f2e1f', border: 0, borderRadius: '8px', font: 'inherit', cursor: 'pointer' }}>
              Reload page
            </button>
            {/* A document navigation recovers even when the client router is broken. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <p><a href="/" style={{ color: '#FF8A9D' }}>Go to the homepage</a></p>
          </div>
        </main>
      </body>
    </html>
  );
}
