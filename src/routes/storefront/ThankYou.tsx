import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Pause, Play, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';

export const ThankYou: React.FC = () => {
  const navigate = useNavigate();
  const orderNumber = useStore((s) => s.orderNumber);
  const cart = useStore((s) => s.cart);

  const [timeLeft, setTimeLeft] = useState(5);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    if (timeLeft <= 0) {
      navigate('/onboarding');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isPaused, navigate]);

  const progressPercent = ((5 - timeLeft) / 5) * 100;

  return (
    <div className="w-full max-w-xl mx-auto px-6 py-16 flex flex-col items-center text-center">
      <div className="w-full bg-[#FFFFFF] border border-[#CFC8BB] rounded-md p-8 sm:p-10 shadow-2 flex flex-col items-center gap-6">
        {/* Animated Check Icon */}
        <div className="w-16 h-16 rounded-full bg-[#E1F0E8] text-[#2F7D57] flex items-center justify-center">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline
              points="20 6 9 17 4 12"
              className="animate-[dash_0.5s_ease-out_forwards]"
              style={{ strokeDasharray: 30, strokeDashoffset: 0 }}
            />
          </svg>
        </div>

        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-[#2F7D57] font-semibold bg-[#E1F0E8] px-2.5 py-1 rounded-xs">
            Payment Confirmed
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-[#1F2421] font-normal mt-3">
            You’re subscribed.
          </h1>
          <p className="text-sm text-[#4A524D] mt-2 max-w-md">
            One more step: tell us how to configure your sender parameters and delivery preferences.
          </p>
        </div>

        {/* Order mini-card */}
        <div className="w-full p-4 bg-[#FBFAF7] border border-[#E3DED5] rounded-sm flex items-center justify-between text-xs font-mono text-[#1F2421]">
          <div className="text-left">
            <span className="text-[#7A817B]">ORDER REFERENCE:</span>
            <div className="font-semibold text-sm">{orderNumber}</div>
          </div>
          <div className="text-right">
            <span className="text-[#7A817B]">PLAN:</span>
            <div className="font-semibold text-sm">{cart?.planName || 'Growth'} Plan</div>
          </div>
        </div>

        {/* Visible 5-second redirect countdown ring per PRD §9.5 */}
        <div className="w-full p-4 bg-[#E4ECE7]/40 border border-[#24473B]/20 rounded-md flex flex-col items-center gap-3">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#CFC8BB"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#24473B"
                strokeWidth="3"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 - (125.6 * progressPercent) / 100}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <span className="absolute font-mono text-xs font-bold text-[#24473B]">
              {timeLeft}s
            </span>
          </div>

          <div className="text-xs font-medium text-[#1F2421]">
            Continuing to custom Tally onboarding in {timeLeft} seconds…
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="font-mono text-[#46617A] hover:underline flex items-center gap-1"
            >
              {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              <span>{isPaused ? 'Resume countdown' : 'Pause'}</span>
            </button>
            <span className="text-[#CFC8BB]">·</span>
            <button
              type="button"
              onClick={() => navigate('/onboarding')}
              className="font-semibold text-[#24473B] hover:underline flex items-center gap-1"
            >
              <span>Go now</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Skip option */}
        <div className="pt-2 text-xs">
          <Link
            to="/app"
            className="text-[#7A817B] hover:text-[#1F2421] hover:underline"
          >
            Skip directly to Control Room →
          </Link>
        </div>
      </div>
    </div>
  );
};
