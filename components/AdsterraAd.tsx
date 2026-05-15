import { useEffect } from 'react';

export default function AdsterraAd() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://code.adsterra.com/banners/adsterra_ad.js';
    script.async = true;

    const adContainer = document.getElementById('adsterra-ad-container');

    if (adContainer && !adContainer.querySelector('script')) {
      adContainer.appendChild(script);
    }

    return () => {
      if (adContainer) {
        adContainer.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="w-full flex justify-center py-8">
      <div
        id="adsterra-ad-container"
        className="w-full max-w-[728px] min-h-[90px] flex items-center justify-center bg-gray-900/50 rounded-lg"
      >
        {import.meta.env.DEV && (
          <div className="text-center">
            <span className="text-xs text-gray-500 block">
              📢 Adsterra ad placeholder (development)
            </span>
            <span className="text-xs text-gray-600">728×90 banner</span>
          </div>
        )}
      </div>
    </div>
  );
}
