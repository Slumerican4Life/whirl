
import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Array<object> & {
      push: (params: object) => void;
      loaded?: boolean;
    };
  }
}

interface AdSenseUnitProps {
  className?: string;
  client: string;
  slot: string;
  format?: string;
  layout?: string;
  responsive?: string;
  style?: React.CSSProperties;
  comment?: string;
}

const AdSenseUnit: React.FC<AdSenseUnitProps> = ({
  className,
  client,
  slot,
  format = 'auto',
  layout,
  responsive,
  style = { display: 'block' },
  comment,
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    const pushAd = () => {
      try {
        if (window.adsbygoogle && !pushed.current) {
          window.adsbygoogle.push({});
          pushed.current = true;
          console.log(`AdSense: Pushed slot ${slot} (${comment || 'No comment'})`);
        }
      } catch (e) {
        console.error(`AdSense: Error pushing slot ${slot}:`, e);
      }
    };

    // Check if script is already loaded
    if (window.adsbygoogle) {
      pushAd();
    } else {
      // Wait for script to load
      const checkForAdsense = setInterval(() => {
        if (window.adsbygoogle) {
          clearInterval(checkForAdsense);
          pushAd();
        }
      }, 100);

      // Clean up interval after 10 seconds
      setTimeout(() => clearInterval(checkForAdsense), 10000);
    }

    return () => {
      pushed.current = false;
    };
  }, [slot, comment]);

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
        data-testid={`adsense-unit-${slot}`}
      />
    </>
  );
};

export default AdSenseUnit;
