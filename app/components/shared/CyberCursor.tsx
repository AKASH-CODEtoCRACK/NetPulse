"use client";

import { useEffect, useState } from "react";

export function CyberCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      // Use requestAnimationFrame for smooth performance
      requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
      });
      
      // Check if hovering over a clickable element
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };

    window.addEventListener("mousemove", updatePosition);
    return () => window.removeEventListener("mousemove", updatePosition);
  }, []);

  return (
    <>
      {/* Hide Default Cursor globally via CSS in global.css, or just add this style block */}
      {/* <style jsx global>{`
        body { cursor: none; }
        a, button { cursor: none; }
      `}</style> */}

      {/* The Main Dot (Instant movement) */}
      <div 
        className="fixed top-0 left-0 w-2 h-2 bg-cyan-400 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ transform: `translate(${position.x - 4}px, ${position.y - 4}px)` }}
      />

      {/* The Glowing Ring (Slight delay/trailing effect) */}
      <div 
        className={`fixed top-0 left-0 border border-cyan-500/50 rounded-full pointer-events-none z-[9999] transition-all duration-100 ease-out ${
          isPointer ? "w-12 h-12 bg-cyan-500/10 border-cyan-400" : "w-8 h-8"
        }`}
        style={{ 
          transform: `translate(${position.x - (isPointer ? 24 : 16)}px, ${position.y - (isPointer ? 24 : 16)}px)` 
        }}
      >
        {/* Crosshair lines for "Tech" feel */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-500/20"></div>
        <div className="absolute left-1/2 top-0 h-full w-[1px] bg-cyan-500/20"></div>
      </div>
    </>
  );
}