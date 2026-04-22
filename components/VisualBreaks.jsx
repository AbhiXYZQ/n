'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Zap, Globe, Cpu, Rocket, Sparkles, Users } from 'lucide-react';

const InteractiveCharacter = ({ char, mouse }) => {
  const ref = useRef(null);
  const distance = useTransform(mouse, (pos) => {
    if (!ref.current) return 0;
    const rect = ref.current.getBoundingClientRect();
    const charX = rect.left + rect.width / 2;
    const charY = rect.top + rect.height / 2;
    const dx = pos.x - charX;
    const dy = pos.y - charY;
    return Math.sqrt(dx * dx + dy * dy);
  });
  const x = useTransform(distance, [0, 250], [60, 0]);
  const y = useTransform(distance, [0, 250], [30, 0]);
  const opacity = useTransform(distance, [0, 250], [0.8, 0.2]);
  return (
    <motion.span ref={ref} style={{ display: 'inline-block', x, y, opacity }} className="select-none cursor-default">
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
};

export const PlexusSection = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouse = useMotionValue({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => mouse.set({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouse]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    let particles = [];
    const particleCount = isMobile ? 40 : 100;
    const resize = () => {
      if (containerRef.current) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = containerRef.current.offsetWidth * dpr;
        canvas.height = containerRef.current.offsetHeight * dpr;
        ctx.scale(dpr, dpr);
      }
    };
    class Particle {
      constructor(w, h) {
        this.x = Math.random() * w; this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.5; this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }
      update(w, h) {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
      }
      draw(ctx) {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00f2ff'; ctx.fill(); // Fallback color
      }
    }
    const init = () => {
      const w = containerRef.current.offsetWidth; const h = containerRef.current.offsetHeight;
      particles = []; for (let i = 0; i < particleCount; i++) particles.push(new Particle(w, h));
    };
    window.addEventListener('resize', resize); resize(); init();
    const animate = () => {
      const w = containerRef.current.offsetWidth; const h = containerRef.current.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => { p.update(w, h); p.draw(ctx); });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animationFrameId); window.removeEventListener('resize', resize); };
  }, []);
  return (
    <section ref={containerRef} className="h-[600px] w-full relative bg-primary/[0.02] overflow-hidden border-y border-primary/10 flex items-center justify-center py-20">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="relative z-10 text-center space-y-12 px-4 w-full">
        <h2 className="text-5xl md:text-8xl font-medium uppercase tracking-tighter leading-none">
          <div className="flex flex-wrap justify-center gap-x-[0.2em]">{"Connecting".split("").map((c, i) => <InteractiveCharacter key={i} char={c} mouse={mouse} />)}</div>
          <div className="flex flex-wrap justify-center gap-x-[0.2em] text-primary">{"the Future".split("").map((c, i) => <InteractiveCharacter key={i} char={c} mouse={mouse} />)}</div>
        </h2>
      </div>
    </section>
  );
};

const InfrastructureCard = ({ item, idx }) => {
  const mouseX = useMotionValue(0); const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-100, 100], [20, -20]);
  const rotateY = useTransform(mouseX, [-100, 100], [-20, 20]);
  const handleMouseMove = (e) => { const rect = e.currentTarget.getBoundingClientRect(); mouseX.set(e.clientX - rect.left - rect.width / 2); mouseY.set(e.clientY - rect.top - rect.height / 2); };
  return (
    <motion.div style={{ perspective: 1000 }} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
      <motion.div onMouseMove={handleMouseMove} onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }} style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="premium-glass p-10 rounded-[2.5rem] flex flex-col items-center gap-8 border border-primary/20 bg-primary/[0.02] relative group cursor-pointer">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] blur-2xl" />
        <motion.div style={{ transform: "translateZ(50px)" }} className="p-6 bg-primary/10 rounded-2xl text-primary shadow-xl group-hover:scale-110 transition-transform duration-500">{item.icon}</motion.div>
        <div style={{ transform: "translateZ(30px)" }} className="text-center space-y-2">
          <h4 className="text-xl font-bold tracking-tight">{item.title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
        </div>
        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"><Sparkles className="w-5 h-5 text-primary/40" /></div>
      </motion.div>
    </motion.div>
  );
};

export const FloatingShowcase = () => {
  return (
    <section className="py-32 relative overflow-hidden bg-background">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, var(--primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="container relative z-10">
        <div className="text-center mb-24 space-y-4">
          <motion.h2 initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="text-4xl md:text-6xl font-bold tracking-tighter">Cutting Edge <span className="hero-text-gradient">Infrastructure</span></motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-muted-foreground max-w-2xl mx-auto text-lg">Built on a high-availability serverless mesh for unmatched speed and reliability.</motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[ { icon: <Zap className="w-8 h-8" />, title: "Ultra Fast", desc: "Global edge network with <50ms latency." }, { icon: <Globe className="w-8 h-8" />, title: "Decentralized", desc: "No single point of failure. Ever." }, { icon: <Cpu className="w-8 h-8" />, title: "AI Optimized", desc: "Native support for GPU workflows." }, { icon: <Rocket className="w-8 h-8" />, title: "Auto Scale", desc: "Scale from 0 to 1M users instantly." } ].map((item, idx) => <InfrastructureCard key={idx} item={item} idx={idx} />)}
        </div>
      </div>
    </section>
  );
};

export const ImpactNumbers = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouse = useMotionValue({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => mouse.set({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouse]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Resolve CSS variables to actual colors
    const getThemeColor = () => {
        const style = getComputedStyle(document.documentElement);
        const primary = style.getPropertyValue('--primary').trim();
        return `hsl(${primary.replace(/ /g, ', ')})`;
    };

    let time = 0;
    const resize = () => {
      if (containerRef.current) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = containerRef.current.offsetWidth * dpr;
        canvas.height = containerRef.current.offsetHeight * dpr;
        ctx.scale(dpr, dpr);
      }
    };

    window.addEventListener('resize', resize);
    resize();

    const continents = [
        { lat: 20, lng: 77 }, { lat: 40, lng: -100 }, { lat: -20, lng: -60 },
        { lat: 50, lng: 10 }, { lat: 10, lng: 20 }, { lat: -25, lng: 135 }, { lat: 35, lng: 105 },
    ];

    const draw = () => {
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      const progress = smoothProgress.get();
      const primaryColor = getThemeColor();
      
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = 240 + (progress * 50);

      // 1. Atmosphere Glow
      const grad = ctx.createRadialGradient(centerX, centerY, radius * 0.7, centerX, centerY, radius * 1.6);
      grad.addColorStop(0, primaryColor.replace(')', ', 0.2)').replace('hsl', 'hsla'));
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Sphere Base
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#080808';
      ctx.fill();
      ctx.strokeStyle = primaryColor.replace(')', ', 0.3)').replace('hsl', 'hsla');
      ctx.lineWidth = 2;
      ctx.stroke();

      // 3. Grid Lines
      ctx.lineWidth = 1;
      for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2 + time;
          const xOffset = Math.sin(angle) * radius;
          if (Math.abs(xOffset) < radius) {
              ctx.beginPath();
              ctx.moveTo(centerX + xOffset, centerY - Math.sqrt(radius**2 - xOffset**2));
              ctx.lineTo(centerX + xOffset, centerY + Math.sqrt(radius**2 - xOffset**2));
              ctx.strokeStyle = primaryColor.replace(')', ', 0.15)').replace('hsl', 'hsla');
              ctx.stroke();
          }
      }

      // 4. Continent Particles
      const particleDensity = 2500;
      for (let i = 0; i < particleDensity; i++) {
          const phi = Math.acos(-1 + (2 * i) / particleDensity);
          const theta = Math.sqrt(particleDensity * Math.PI) * phi + time * 0.5;
          const lat = (phi * 180 / Math.PI) - 90;
          const lng = (theta * 180 / Math.PI) % 360 - 180;
          
          let isLand = false;
          continents.forEach(c => {
              const dLat = lat - c.lat;
              const dLng = lng - c.lng;
              if (Math.sqrt(dLat*dLat + dLng*dLng) < 30) isLand = true;
          });

          if (isLand) {
              const x = radius * Math.sin(phi) * Math.cos(theta);
              const y = radius * Math.sin(phi) * Math.sin(theta);
              const z = radius * Math.cos(phi);
              const depth = (z + radius) / (2 * radius);
              
              if (z > -20) {
                  ctx.beginPath();
                  ctx.arc(centerX + x, centerY + y, 1.5, 0, Math.PI * 2);
                  ctx.fillStyle = primaryColor.replace(')', `, ${0.4 + depth * 0.6})`).replace('hsl', 'hsla');
                  ctx.fill();
              }
          }
      }

      time += 0.007;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationFrameId); };
  }, [smoothProgress]);

  return (
    <section ref={containerRef} className="h-[150vh] bg-[#020202] relative overflow-hidden flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
      
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none">
        <h2 className="text-[14vw] font-black uppercase tracking-tighter leading-none flex flex-col items-center select-none">
            <div className="flex gap-x-12 text-primary/30">
                {"BEYOND".split("").map((c, i) => <InteractiveCharacter key={i} char={c} mouse={mouse} />)}
            </div>
            <div className="flex gap-x-12 text-primary/10">
                {"BORDERS".split("").map((c, i) => <InteractiveCharacter key={i} char={c} mouse={mouse} />)}
            </div>
        </h2>
        
        <motion.div 
            style={{ 
                opacity: useTransform(smoothProgress, [0.4, 0.5, 0.6], [0, 1, 0]),
                scale: useTransform(smoothProgress, [0.4, 0.5, 0.6], [0.8, 1, 0.8])
            }}
            className="mt-10 px-10 py-4 border-2 border-primary/40 rounded-full bg-primary/10 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,242,255,0.2)]"
        >
            <span className="text-primary text-base font-black tracking-[0.5em] uppercase">Nainix Global Node</span>
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none opacity-80" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
    </section>
  );
};
