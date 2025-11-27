
'use client';

import { useState, useEffect } from 'react';
import { Smartphone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const PHONE_WIDTH = 414; // iPhone XR/11 width
const PHONE_HEIGHT = 896; // iPhone XR/11 height

export function DeviceSimulator() {
  const [isPhoneMode, setIsPhoneMode] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const isActuallyMobile = useIsMobile();
  const pathname = usePathname(); // Use Next.js hook to track route changes
  const [iframeKey, setIframeKey] = useState(Date.now());

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    // When the path changes, update the iframe key to force a reload
    if (isPhoneMode) {
      setIframeKey(Date.now());
    }
  }, [pathname, isPhoneMode]);


  const handleToggle = () => {
    setIsPhoneMode(!isPhoneMode);
    if (!isPhoneMode) {
       setIframeKey(Date.now()); // Ensure fresh load when opening
    }
  };

  // Only render this tool if it's running on the client, in dev mode, and not on an actual mobile device.
  if (!isClient || process.env.NEXT_PUBLIC_DEV_MODE !== 'true' || isActuallyMobile) {
    return null;
  }

  return (
    <>
      {isPhoneMode && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div
            className="relative flex flex-col overflow-hidden rounded-[40px] border-[14px] border-black bg-white shadow-2xl"
            style={{ width: PHONE_WIDTH, height: PHONE_HEIGHT }}
          >
            <div className="absolute top-0 left-1/2 z-10 h-7 w-[160px] -translate-x-1/2 rounded-b-xl bg-black" />
            <div className="h-full w-full overflow-y-auto rounded-[26px]">
                <iframe
                  key={iframeKey}
                  src={pathname}
                  className="h-full w-full border-0"
                  title="Device Simulator"
                />
            </div>
          </div>
        </div>
      )}
      <div className={cn("fixed bottom-4 right-4 z-[210]", isPhoneMode && "bottom-auto top-4 right-4")}>
        <Button
          variant={isPhoneMode ? "destructive" : "secondary"}
          size="icon"
          onClick={handleToggle}
          className="h-12 w-12 rounded-full shadow-lg"
          aria-label={isPhoneMode ? "Close mobile view" : "Switch to mobile view"}
          title={isPhoneMode ? "Close Simulator" : "Simulate Phone View"}
        >
          {isPhoneMode ? <X className="h-6 w-6" /> : <Smartphone className="h-6 w-6" />}
        </Button>
      </div>
    </>
  );
}
