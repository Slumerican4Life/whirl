
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
          console.log(`✅ AdSense: Successfully pushed slot ${slot} (${comment || 'No comment'})`);
        }
      } catch (e) {
        console.error(`❌ AdSense: Error pushing slot ${slot}:`, e);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (window.adsbygoogle) {
        pushAd();
      } else {
        // Wait for script to load with retry mechanism
        let retries = 0;
        const maxRetries = 50; // 5 seconds max wait
        
        const checkForAdsense = setInterval(() => {
          retries++;
          if (window.adsbygoogle) {
            clearInterval(checkForAdsense);
            pushAd();
          } else if (retries >= maxRetries) {
            clearInterval(checkForAdsense);
            console.warn(`⚠️ AdSense: Timeout waiting for adsbygoogle to load for slot ${slot}`);
          }
        }, 100);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
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
    <div className={`adsense-container ${className || ''}`}>
      {comment && (
        <div className="sr-only" aria-hidden="true">
          {/* AdSense Unit: {comment} */}
        </div>
      )}
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        {...adProps}
        data-testid={`adsense-unit-${slot}`}
      />
    </div>
  );
};

export default AdSenseUnit;
