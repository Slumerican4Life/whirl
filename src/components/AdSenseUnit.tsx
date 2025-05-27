
import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: {
      push: (params: object) => void;
      loaded?: boolean;
    }[];
  }
}

interface AdSenseUnitProps {
  className?: string;
  client: string;
  slot: string;
  format?: string; // e.g., 'auto', 'fluid', 'autorelaxed'
  layout?: string; // e.g., 'in-article' (for data-ad-layout attribute)
  responsive?: string; // 'true' or 'false' for data-full-width-responsive
  style?: React.CSSProperties;
  comment?: string; // For identifying the ad unit in comments
}

const AdSenseUnit: React.FC<AdSenseUnitProps> = ({
  className,
  client,
  slot,
  format = 'auto',
  layout,
  responsive, // data-full-width-responsive defaults to true if this prop is 'true'
  style = { display: 'block' }, // Default style for <ins>
  comment,
}) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const attemptPush = () => {
      try {
        if (window.adsbygoogle && typeof window.adsbygoogle.push === 'function') {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.log(`AdSense: Pushed slot ${slot} (${comment || 'No comment'})`);
        } else {
          console.warn(`AdSense: window.adsbygoogle.push not available for slot ${slot}. Retrying...`);
          // Optional: implement a more sophisticated retry with backoff
          setTimeout(attemptPush, 1000); // Retry after 1 second
        }
      } catch (e) {
        console.error(`AdSense: Error pushing slot ${slot}:`, e);
      }
    };
    
    if (window.adsbygoogle?.loaded) {
      attemptPush();
    } else {
      // If adsbygoogle is not loaded yet, wait for it.
      // This is a simple check; more robust would be an event listener for script load.
      const SCRIPT_ID = 'adsbygoogle-script'; // Assuming the main script has an ID or find another way
      const script = document.querySelector(`script[src*="adsbygoogle.js"]`);
      if (script) {
        script.addEventListener('load', attemptPush);
        script.addEventListener('error', () => console.error(`AdSense: Failed to load adsbygoogle.js for slot ${slot}`));
        // Clean up event listener
        return () => {
          script.removeEventListener('load', attemptPush);
        };
      } else {
        // Fallback if script is not found (e.g. ad blocker removed it)
        console.warn(`AdSense: Main adsbygoogle.js script not found for slot ${slot}. Ads may not load.`);
        // Still try to push, maybe it loads later
        setTimeout(attemptPush, 2000);
      }
    }

  }, [slot, comment]); // Re-run if slot or comment changes

  const adProps: { [key: string]: string | undefined } = {
    'data-ad-client': client,
    'data-ad-slot': slot,
    'data-ad-format': format,
  };
  if (layout) {
    adProps['data-ad-layout'] = layout;
  }
  if (responsive === 'true') {
    adProps['data-full-width-responsive'] = 'true';
  }


  return (
    <>
      {comment && <script dangerouslySetInnerHTML={{ __html: `/* ${comment} */` }} />}
      <ins
        ref={adRef}
        className={`adsbygoogle ${className || ''}`}
        style={style}
        {...adProps}
      />
      <script dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }} />
    </>
  );
};

export default AdSenseUnit;

