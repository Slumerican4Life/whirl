
import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Array<object> & { // It's an array...
      push: (params: object) => void; // ...that has a push method
      loaded?: boolean; // ...and an optional loaded flag
    };
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
          // Ensure adsbygoogle is treated as an array for the push operation
          // The actual push is on the adsbygoogle array-like object itself.
          const adsQueue = window.adsbygoogle || [];
          adsQueue.push({}); // Push an empty object for the ad slot
          console.log(`AdSense: Pushed slot ${slot} (${comment || 'No comment'})`);
        } else {
          console.warn(`AdSense: window.adsbygoogle.push not available for slot ${slot}. Retrying...`);
          setTimeout(attemptPush, 1000); // Retry after 1 second
        }
      } catch (e) {
        console.error(`AdSense: Error pushing slot ${slot}:`, e);
      }
    };
    
    // Check if the adsbygoogle script has loaded using its 'loaded' property
    if (window.adsbygoogle?.loaded) {
      attemptPush();
    } else {
      const SCRIPT_ID = 'adsbygoogle-script'; // ID of the main AdSense script in index.html
      // Attempt to find the script element by its known src pattern or ID
      const script = document.querySelector(`script[src*="adsbygoogle.js"][id="${SCRIPT_ID}"], script[src*="adsbygoogle.js"]`) as HTMLScriptElement | null;
      if (script) {
        const handleScriptLoad = () => {
          // Once the script is loaded, set the global 'loaded' flag if AdSense does this.
          // Or, more simply, just attempt the push.
          if (window.adsbygoogle) { // Check again in case it initialized
            window.adsbygoogle.loaded = true; // Manually indicate loaded if not set by script
          }
          attemptPush();
          script.removeEventListener('load', handleScriptLoad); // Clean up
          script.removeEventListener('error', handleScriptError); // Clean up
        };
        const handleScriptError = () => {
          console.error(`AdSense: Failed to load adsbygoogle.js for slot ${slot}`);
          script.removeEventListener('load', handleScriptLoad); // Clean up
          script.removeEventListener('error', handleScriptError); // Clean up
        };
        
        script.addEventListener('load', handleScriptLoad);
        script.addEventListener('error', handleScriptError);
      } else {
        console.warn(`AdSense: Main adsbygoogle.js script not found for slot ${slot}. Ads may not load. Attempting push anyway.`);
        setTimeout(attemptPush, 2000); // Fallback push attempt
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

  // The second script tag for pushing is often not needed if the useEffect handles it,
  // especially for dynamically inserted ad units.
  // However, AdSense docs sometimes show it. If issues persist, it might be re-added.
  // For now, relying on useEffect to push after the <ins> tag is rendered.
  return (
    <>
      {comment && <script dangerouslySetInnerHTML={{ __html: `/* ${comment} */` }} />}
      <ins
        ref={adRef}
        className={`adsbygoogle ${className || ''}`}
        style={style}
        {...adProps}
        data-testid={`adsense-unit-${slot}`} // For testing
      />
    </>
  );
};

export default AdSenseUnit;

