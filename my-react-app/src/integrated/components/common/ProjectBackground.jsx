import React from 'react';

/**
 * Global background using the user-provided sunlit cozy workspace image
 * with a subtle blur effect and gentle warm overlay for optimal readability.
 */
export default function ProjectBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none bg-[#FFF5ED]"
    >
      {/* User-provided background image preserving aspect ratio with subtle blur */}
      <img
        src="/workspace-bg.png"
        alt=""
        className="w-full h-full object-cover object-center filter blur-[3.5px] scale-105 transform-gpu opacity-95 transition-all duration-300"
      />

      {/* Subtle warm ambient overlay so text, buttons, and cards remain sharp and readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF5ED]/25 via-white/10 to-[#FFF3EB]/35" />
    </div>
  );
}
