import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
  minDuration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  minDuration = 1000,
}) => {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadingOut(true);
      const finishTimer = setTimeout(() => {
        onFinish?.();
      }, 400);
      return () => clearTimeout(finishTimer);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-[#090D16] text-white transition-opacity duration-400 select-none ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 35%, rgba(16, 185, 129, 0.15) 0%, rgba(9, 13, 22, 1) 70%)',
      }}
    >
      {/* Top ambient glow bar */}
      <div className="w-full flex justify-center pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400">
          <Sparkles size={12} className="animate-spin-slow" />
          <span>تتبع عاداتك بلا إنترنت • Offline First</span>
        </div>
      </div>

      {/* Center Branding & Logo */}
      <div className="flex flex-col items-center text-center space-y-6">
        {/* Glow halo behind icon */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/30 via-teal-400/20 to-cyan-500/30 rounded-3xl blur-xl animate-pulse" />
          
          <div className="relative w-28 h-28 rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/30 shadow-emerald-500/20 bg-[#0B111E] flex items-center justify-center">
            <img
              src="/icon-192.png"
              alt="Habitly Logo"
              className="w-full h-full object-cover transform scale-105"
            />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-400 bg-clip-text text-transparent font-['Plus_Jakarta_Sans',sans-serif]">
            Habitly
          </h1>
          <p className="text-sm font-medium text-stone-300 font-['Tajawal',sans-serif]">
            ابنِ عاداتك، اصنع نجاحك اليومي
          </p>
          <p className="text-[11px] text-stone-500 tracking-wider uppercase font-['Plus_Jakarta_Sans',sans-serif]">
            Build Habits • Master Life
          </p>
        </div>
      </div>

      {/* Bottom Loading Progress Indicator */}
      <div className="w-full max-w-xs space-y-3 pb-6 flex flex-col items-center">
        {/* Smooth modern progress line */}
        <div className="w-48 h-1 bg-stone-800 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-400 rounded-full animate-loading-bar"
          />
        </div>

        <div className="flex items-center gap-2 text-stone-400 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-['Tajawal',sans-serif]">جارٍ تجهيز مساحتك الشخصية...</span>
        </div>
      </div>
    </div>
  );
};
