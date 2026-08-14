import React from 'react';

// Interstitial ad temporarily disabled — skip callback fires immediately
interface InterstitialAdProps {
  onSkip: () => void;
}

const InterstitialAd: React.FC<InterstitialAdProps> = ({ onSkip }) => {
  // Call onSkip synchronously so the conversion starts without any delay
  React.useEffect(() => {
    onSkip();
  }, [onSkip]);

  return null;
};

export default InterstitialAd;