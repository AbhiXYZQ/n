'use client';

import React, { useEffect, useRef } from 'react';

const MagneticGrid = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 }); // Start off-screen

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const resize = () => {
      if (containerRef.current) {
        const dpr = window.devicePixelRatio || 1;
        const displayWidth = containerRef.current.offsetWidth;
        const displayHeight = containerRef.current.offsetHeight;
        
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;
        
        ctx.scale(dpr, dpr);
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();

    const draw = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      
      ctx.clearRect(0, 0, width, height);
      
      const gap = 30;
      const length = 10;
      
      const style = getComputedStyle(document.documentElement);
      const primaryHSL = style.getPropertyValue('--primary').trim();
      const isDark = document.documentElement.classList.contains('dark');
      
      // Handle the case where HSL values might be space-separated or comma-separated
      const formattedHSL = primaryHSL.includes(',') ? primaryHSL : primaryHSL.replace(/ /g, ', ');

      for (let x = gap / 2; x < width; x += gap) {
        for (let y = gap / 2; y < height; y += gap) {
          const dx = mouseRef.current.x - x;
          const dy = mouseRef.current.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          const angle = Math.atan2(dy, dx);
          
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          
          // Subtle glow effect for closer lines
          const influence = Math.max(0, 1 - distance / 600);
          const opacity = 0.2 + (influence * 0.5);
          
          ctx.strokeStyle = `hsla(${formattedHSL}, ${isDark ? opacity : opacity * 0.8})`;
          ctx.lineWidth = 1.2 + (influence * 0.8);
          ctx.lineCap = 'round';
          
          ctx.beginPath();
          ctx.moveTo(-length / 2, 0);
          ctx.lineTo(length / 2, 0);
          ctx.stroke();
          
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none opacity-60">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};

export default MagneticGrid;
