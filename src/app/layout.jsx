import ClientLayout from '../components/ClientLayout';
import '../index.css';

export const metadata = {
    title: 'Supercheap Tyres - Super Value, Super Safe',
    description: 'Get the best value and safety with Supercheap Tyres. We offer a wide range of quality tyres, easy booking, and secure payments.',
    other: {
        'facebook-domain-verification': 'your-code', // if any
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en-GB">
            <head>
                <link rel="icon" type="image/x-icon" href="/favicon.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://embed.tawk.to" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://maps.googleapis.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&family=Roboto:wght@400;500;700;900&family=Plus+Jakarta+Sans:wght@500;600&family=Open+Sans:wght@400;600&display=swap"
                    rel="stylesheet" />
            </head>
            <body className="bg-white">
                <ClientLayout>{children}</ClientLayout>

                {/* Third Party Scripts similar to index.html */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
            window.Tawk_API = window.Tawk_API || {};
            window.Tawk_LoadStart = new Date();
            (function () {
              const mapsSrc = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAaa7MG_K3DMQ7K-gpSRuNMfZdRS1jV14U&libraries=places';
              const tawkSrc = 'https://embed.tawk.to/69142d52f6ff90195b6c9ea3/1j9rd236m';
              
              let hasLoaded = false;
              const loadThirdPartyScripts = () => {
                if (hasLoaded) return;
                hasLoaded = true;

                const mapsScript = document.createElement('script');
                mapsScript.src = mapsSrc;
                mapsScript.async = true;
                mapsScript.defer = true;
                mapsScript.crossOrigin = 'anonymous';
                document.head.appendChild(mapsScript);

                const tawkScript = document.createElement('script');
                tawkScript.async = true;
                tawkScript.src = tawkSrc;
                tawkScript.charset = 'UTF-8';
                tawkScript.crossOrigin = '*';
                document.body.appendChild(tawkScript);
              };

              if ('requestIdleCallback' in window) {
                window.requestIdleCallback(loadThirdPartyScripts, { timeout: 4000 });
              } else {
                window.setTimeout(loadThirdPartyScripts, 2000);
              }
              window.addEventListener('load', loadThirdPartyScripts, { once: true });
            })();
            `
                    }}
                />
            </body>
        </html>
    );
}
