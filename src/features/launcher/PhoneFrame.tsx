import React, { useState } from 'react';
import { Landing } from '../scan/Landing';
import { RegisterFlow } from '../scan/RegisterFlow';
import { OrderFlow } from '../scan/OrderFlow';
import { RegisterSuccess } from '../scan/RegisterSuccess';
import { OrderSuccess } from '../scan/OrderSuccess';
import { Smartphone, RotateCcw, QrCode } from 'lucide-react';

interface PhoneFrameProps {
  initialScreen?: 'landing' | 'register' | 'order' | 'scan_idle';
  onScanClick?: () => void;
  className?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  initialScreen = 'landing',
  onScanClick,
  className = '',
}) => {
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'scan_idle'>('landing');

  return (
    <div
      className={`relative mx-auto w-[360px] sm:w-[380px] h-[720px] bg-paper-50 rounded-[44px] p-3 shadow-sh-3 border-4 border-ink-900 flex flex-col justify-between overflow-hidden ${className}`}
    >
      {/* Outer Phone Shell Notch & Speaker */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-ink-900 rounded-b-2xl z-30 flex items-center justify-center">
        <div className="w-12 h-1 bg-ink-700 rounded-full" />
        <div className="w-2.5 h-2.5 rounded-full bg-ink-950 ml-3" />
      </div>

      {/* Internal Screen Area */}
      <div className="relative flex-1 bg-paper-50 rounded-[34px] overflow-hidden flex flex-col pt-6 z-10">
        {/* Dynamic Mobile Screen Content */}
        <div className="flex-1 overflow-y-auto">
          {currentScreen === 'scan_idle' ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-paper-0 border-2 border-dashed border-thread-600 flex items-center justify-center text-thread-600 animate-pulse shadow-sh-2">
                <QrCode className="w-10 h-10" />
              </div>
              <h3 className="font-display font-semibold text-lg text-ink-900">
                Ready to scan patch QR
              </h3>
              <p className="text-xs text-text-2 max-w-xs">
                Scan the packaging QR code on any merit patch envelope to launch the verification page.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCurrentScreen('landing');
                  onScanClick?.();
                }}
                className="bg-ink-900 text-paper-0 text-xs font-semibold px-4 py-2.5 rounded-md hover:bg-ink-700 transition-colors shadow-sh-1"
              >
                Simulate Camera Scan →
              </button>
            </div>
          ) : (
            <Landing embeddedInPhone={true} />
          )}
        </div>
      </div>

      {/* Phone Bottom Home Bar */}
      <div className="h-5 flex items-center justify-center pt-1 z-30">
        <div className="w-32 h-1 bg-ink-900/40 rounded-full" />
      </div>
    </div>
  );
};
