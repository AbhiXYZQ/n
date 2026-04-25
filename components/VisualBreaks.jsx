'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence, useMotionTemplate } from 'framer-motion';
import { Zap, Globe, Cpu, Rocket, Sparkles, Users, Terminal, Code, Database, Layers, ArrowRight, Handshake, Shield, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const InteractiveCharacter = ({ 
    char, 
    mouse, 
    className = "", 
    xRange = [40, 0], 
    yRange = [20, 0], 
    scaleRange = [1.1, 1], 
    fontWeightRange = [900, 300] 
}) => {
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

    const x = useTransform(distance, [0, 200], xRange);
    const y = useTransform(distance, [0, 200], yRange);
    const opacity = useTransform(distance, [0, 300], [0.95, 0.6]);
    const scale = useTransform(distance, [0, 200], scaleRange);
    const fontWeight = useTransform(distance, [0, 150], fontWeightRange);

    return (
        <motion.span
            ref={ref}
            style={{ display: 'inline-block', x, y, opacity, scale, fontWeight }}
            className={`select-none cursor-default will-change-transform ${className}`}
        >
            {char === ' ' ? '\u00A0' : char}
        </motion.span>
    );
};

const getThemeColors = () => {
    if (typeof document === 'undefined') return { primary: 'hsl(190, 100%, 50%)', accent: 'hsl(280, 100%, 50%)' };
    const style = getComputedStyle(document.documentElement);
    const primary = style.getPropertyValue('--primary').trim() || '190 100% 50%';
    const accent = style.getPropertyValue('--accent').trim() || '280 100% 50%';
    return {
        primary: `hsl(${primary.replace(/ /g, ', ')})`,
        accent: `hsl(${accent.replace(/ /g, ', ')})`
    };
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
        let time = 0;
        const resize = () => {
            if (containerRef.current && canvas) {
                const dpr = window.devicePixelRatio || 1;
                canvas.width = containerRef.current.offsetWidth * dpr;
                canvas.height = containerRef.current.offsetHeight * dpr;
                ctx.scale(dpr, dpr);
            }
        };
        window.addEventListener('resize', resize); resize();

        const continents = [{ lat: 20, lng: 77 }, { lat: 40, lng: -100 }, { lat: -20, lng: -60 }, { lat: 50, lng: 10 }, { lat: 10, lng: 20 }, { lat: -25, lng: 135 }, { lat: 35, lng: 105 }];

        // MULTICOLOR Satellites
        const satellites = [...Array(15)].map((_, i) => ({
            phi: Math.random() * Math.PI * 2,
            theta: Math.random() * Math.PI,
            radius: 180 + Math.random() * 50,
            speed: 0.01 + Math.random() * 0.02,
            color: i % 3 === 0 ? 'hsl(190, 100%, 50%)' : i % 3 === 1 ? 'hsl(280, 100%, 60%)' : 'hsl(45, 100%, 50%)'
        }));

        const draw = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.offsetWidth;
            const height = containerRef.current.offsetHeight;
            if (width === 0) return;
            const colors = getThemeColors();
            ctx.clearRect(0, 0, width, height);
            const centerX = width / 2;
            const centerY = height / 2;

            // REDUCED BASE SIZE
            const radius = 170 + (smoothProgress.get() * 20);

            // 1. Transparent Atmospheric Gradient (Multi-Color)
            const atmGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius * 1.4);
            atmGrad.addColorStop(0, colors.primary.replace(')', ', 0.15)').replace('hsl', 'hsla'));
            atmGrad.addColorStop(0.5, colors.accent.replace(')', ', 0.05)').replace('hsl', 'hsla'));
            atmGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = atmGrad;
            ctx.beginPath(); ctx.arc(centerX, centerY, radius * 1.5, 0, Math.PI * 2); ctx.fill();

            // 2. High-Tech Grid Rings (Multi-Color)
            ctx.lineWidth = 1;
            for (let i = 0; i < 8; i++) {
                ctx.beginPath();
                ctx.ellipse(centerX, centerY, radius, radius * Math.abs(Math.cos(i * Math.PI / 8)), time * 0.1, 0, Math.PI * 2);
                const ringColor = i % 2 === 0 ? colors.primary : colors.accent;
                ctx.strokeStyle = ringColor.replace(')', ', 0.1)').replace('hsl', 'hsla');
                ctx.stroke();
            }

            // 3. Transparent Continent Particles
            const particleDensity = 2000;
            for (let i = 0; i < particleDensity; i++) {
                const phi = Math.acos(-1 + (2 * i) / particleDensity);
                const theta = Math.sqrt(particleDensity * Math.PI) * phi + time * 0.4;
                const lat = (phi * 180 / Math.PI) - 90;
                const lng = (theta * 180 / Math.PI) % 360 - 180;
                let isLand = false;
                continents.forEach(c => { const dLat = lat - c.lat; const dLng = lng - c.lng; if (Math.sqrt(dLat * dLat + dLng * dLng) < 32) isLand = true; });
                if (isLand) {
                    const x = radius * Math.sin(phi) * Math.cos(theta); const y = radius * Math.sin(phi) * Math.sin(theta); const z = radius * Math.cos(phi);
                    if (z > -radius * 0.3) {
                        const scale = (z + radius) / (2 * radius);
                        ctx.beginPath(); ctx.arc(x + centerX, y + centerY, 1.4 * scale, 0, Math.PI * 2);
                        ctx.fillStyle = colors.primary.replace(')', `, ${0.3 + scale * 0.6})`).replace('hsl', 'hsla'); ctx.fill();
                        if (Math.random() > 0.995) { ctx.fillStyle = '#fff'; ctx.arc(x + centerX, y + centerY, 2 * scale, 0, Math.PI * 2); ctx.fill(); }
                    }
                }
            }

            // 4. Data Satellites (Multi-Color Orbitals)
            satellites.forEach(s => {
                s.phi += s.speed;
                const x = s.radius * Math.sin(s.theta) * Math.cos(s.phi);
                const y = s.radius * Math.sin(s.theta) * Math.sin(s.phi);
                const z = s.radius * Math.cos(s.theta);
                const scale = (z + s.radius) / (2 * s.radius);
                if (z > 0) {
                    ctx.beginPath(); ctx.arc(x + centerX, y + centerY, 2.5 * scale, 0, Math.PI * 2);
                    ctx.fillStyle = s.color;
                    ctx.shadowBlur = 10; ctx.shadowColor = s.color; ctx.fill(); ctx.shadowBlur = 0;
                    ctx.beginPath(); ctx.moveTo(x + centerX, y + centerY); ctx.lineTo(centerX + x * 0.9, centerY + y * 0.9);
                    ctx.strokeStyle = s.color.replace(')', ', 0.3)').replace('hsl', 'hsla'); ctx.lineWidth = 1.5 * scale; ctx.stroke();
                }
            });

            time += 0.007; animationFrameId = requestAnimationFrame(draw);
        };
        draw();
        return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationFrameId); };
    }, [smoothProgress]);

    return (
        <section ref={containerRef} className="h-[60vh] md:h-[100vh] bg-background relative overflow-hidden flex items-center justify-center">
            <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none px-4">
                <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-light uppercase tracking-widest leading-none flex flex-col items-center select-none text-center w-full overflow-hidden px-2">
                    <div className="flex justify-center gap-x-1 md:gap-x-6 text-transparent w-full" style={{ WebkitTextStroke: '1.5px hsl(var(--foreground) / 0.2)', WebkitTextFillColor: 'transparent' }}>
                        {"BEYOND".split("").map((c, i) => <InteractiveCharacter key={`beyond-${i}`} char={c} mouse={mouse} />)}
                    </div>
                    <div className="flex justify-center gap-x-1 md:gap-x-6 text-transparent w-full mt-3 md:mt-8" style={{ WebkitTextStroke: '1.5px hsl(var(--foreground) / 0.1)', WebkitTextFillColor: 'transparent' }}>
                        {"BORDERS".split("").map((c, i) => <InteractiveCharacter key={`borders-${i}`} char={c} mouse={mouse} />)}
                    </div>
                </h2>
                <motion.div style={{ opacity: useTransform(smoothProgress, [0.3, 0.5, 0.7], [0, 1, 0]) }} className="mt-6 md:mt-10 px-5 md:px-8 py-2 md:py-3 border border-primary/40 rounded-full premium-glass">
                    <span className="text-primary text-xs md:text-sm font-black tracking-[0.3em] md:tracking-[0.5em] uppercase">Global Data Stream</span>
                </motion.div>
            </div>
        </section>
    );
};

export const NeuralEngine = () => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
    const mouse = useMotionValue({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            mouse.set({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouse]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let time = 0;

        const resize = () => {
            if (!containerRef.current || !canvas) return;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = containerRef.current.offsetWidth * dpr;
            canvas.height = containerRef.current.offsetHeight * dpr;
            ctx.scale(dpr, dpr);
        };
        window.addEventListener('resize', resize); resize();

        const draw = () => {
            if (!containerRef.current) return;
            const w = containerRef.current.offsetWidth;
            const h = containerRef.current.offsetHeight;
            if (w === 0) return;
            const colors = getThemeColors();

            ctx.clearRect(0, 0, w, h);

            // Subtle Core Glow
            const pulse = Math.sin(time * 2) * 10;
            const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, 300 + pulse);
            grad.addColorStop(0, colors.primary.replace(')', ', 0.08)').replace('hsl', 'hsla'));
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            // Quantum Data Grid (Undulating Wave Field)
            const cols = Math.floor(w / 40) + 1;
            const rows = Math.floor(h / 40) + 1;
            const spacingX = w / (cols - 1 || 1);
            const spacingY = h / (rows - 1 || 1);

            const mouseX = mouse.get().x;
            const mouseY = mouse.get().y;

            ctx.lineWidth = 1;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const bx = i * spacingX;
                    const by = j * spacingY;

                    // Wave Math (Organic surface)
                    const wave = Math.sin(i * 0.3 + time) * Math.cos(j * 0.3 + time * 0.8);

                    // Mouse Interaction
                    const dx = bx - mouseX;
                    const dy = by - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const force = Math.max(0, (200 - dist) / 200);

                    const x = bx + (dx * force * 0.2);
                    const y = by + (dy * force * 0.2) + wave * 10;

                    // Node Drawing
                    const radius = 1 + (wave + 1) * 1.5 + (force * 3);
                    const alpha = 0.1 + (wave + 1) * 0.2 + (force * 0.5);

                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.fillStyle = colors.primary.replace(')', `, ${alpha})`).replace('hsl', 'hsla');

                    if (force > 0.5 || wave > 0.8) {
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = colors.primary;
                    } else {
                        ctx.shadowBlur = 0;
                    }
                    ctx.fill();

                    // Connect to neighbors if highly active
                    ctx.shadowBlur = 0;
                    if ((wave > 0.3 || force > 0.3) && i < cols - 1) {
                        const nextX = (i + 1) * spacingX;
                        const nextY = j * spacingY + Math.sin((i + 1) * 0.3 + time) * Math.cos(j * 0.3 + time * 0.8) * 10;
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(nextX, nextY);
                        ctx.strokeStyle = colors.primary.replace(')', `, ${alpha * 0.3})`).replace('hsl', 'hsla');
                        ctx.stroke();
                    }
                    if ((wave > 0.3 || force > 0.3) && j < rows - 1) {
                        const nextX = i * spacingX;
                        const nextY = (j + 1) * spacingY + Math.sin(i * 0.3 + time) * Math.cos((j + 1) * 0.3 + time * 0.8) * 10;
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(nextX, nextY);
                        ctx.strokeStyle = colors.primary.replace(')', `, ${alpha * 0.3})`).replace('hsl', 'hsla');
                        ctx.stroke();
                    }
                }
            }

            time += 0.02; animationFrameId = requestAnimationFrame(draw);
        };
        draw();
        return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationFrameId); };
    }, [mouse]);

    return (
        <section ref={containerRef} className="min-h-[70vh] md:h-[120vh] bg-background relative overflow-hidden flex flex-col items-center justify-center border-y border-primary/10 py-16 md:py-0">
            <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
            <div className="relative z-10 text-center space-y-6 md:space-y-8 px-4 w-full">
                <motion.div style={{ opacity: useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]), scale: useTransform(scrollYProgress, [0.1, 0.3], [0.9, 1]) }} className="space-y-5 md:space-y-6 flex flex-col items-center">
                    <div className="flex justify-center mb-1 md:mb-2">
                        <div className="relative flex items-center justify-center w-16 h-16 md:w-24 md:h-24 rounded-full bg-background/50 backdrop-blur-sm border border-primary/20">
                            <div className="absolute inset-[-2px] rounded-full border-t-2 border-primary/50 animate-[spin_4s_linear_infinite]" />
                            <div className="absolute inset-2 rounded-full border-b-2 border-accent/40 animate-[spin_3s_linear_infinite_reverse]" />
                            <span className="text-2xl md:text-4xl text-primary font-serif">ॐ</span>
                        </div>
                    </div>
                    <h2 className="text-4xl sm:text-6xl md:text-[7rem] font-black tracking-tighter leading-[0.9] uppercase relative select-none">
                        Powered <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">By AI.</span>
                    </h2>
                    <p className="text-muted-foreground text-base sm:text-xl md:text-2xl max-w-2xl mx-auto font-medium px-2">
                        Advanced Neural Engine matching in <span className="text-primary italic">milliseconds.</span>
                    </p>
                    <div className="pt-4 md:pt-10">
                        <Button size="lg" className="h-12 md:h-16 px-8 md:px-16 rounded-full text-base md:text-lg font-bold uppercase tracking-[0.15em] bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_rgba(var(--primary),0.3)] transition-all duration-300 group active:scale-95">
                            Access AI Engine
                            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export const PlexusSection = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const mouse = useMotionValue({ x: 0, y: 0 });
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            mouse.set({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouse]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let time = 0;
        const resize = () => {
            if (containerRef.current && canvas) {
                const dpr = window.devicePixelRatio || 1;
                canvas.width = containerRef.current.offsetWidth * dpr;
                canvas.height = containerRef.current.offsetHeight * dpr;
                ctx.scale(dpr, dpr);
            }
        };
        window.addEventListener('resize', resize); resize();
        const animate = () => {
            if (!containerRef.current) return;
            const w = containerRef.current.offsetWidth;
            const h = containerRef.current.offsetHeight;
            if (w === 0) return;
            const colors = getThemeColors();
            const m = mouse.get();
            ctx.clearRect(0, 0, w, h);
            const spacing = 50;
            const rows = Math.ceil(h / spacing) + 1;
            const cols = Math.ceil(w / spacing) + 1;
            for (let j = 0; j < rows; j++) {
                ctx.beginPath();
                for (let i = 0; i < cols; i++) {
                    const bx = i * spacing;
                    const by = j * spacing;
                    const waveX = Math.sin(time + i * 0.3 + j * 0.2) * 15;
                    const waveY = Math.cos(time + j * 0.3 + i * 0.2) * 15;
                    const dx = (bx + waveX) - m.x;
                    const dy = (by + waveY) - m.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const force = Math.max(0, (300 - dist) / 300);
                    const x = bx + waveX + dx * force * 1.5;
                    const y = by + waveY + dy * force * 1.5;
                    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                    ctx.save(); ctx.beginPath(); ctx.arc(x, y, 3 * (0.8 + force), 0, Math.PI * 2);
                    ctx.fillStyle = colors.primary.replace(')', `, ${0.4 + force * 0.6})`).replace('hsl', 'hsla');
                    ctx.shadowBlur = 10 * force; ctx.shadowColor = colors.primary; ctx.fill(); ctx.restore();
                }
                ctx.strokeStyle = colors.primary.replace(')', `, ${0.3 + (Math.sin(time) + 1) * 0.2})`).replace('hsl', 'hsla');
                ctx.lineWidth = 2.5; ctx.shadowBlur = 5; ctx.shadowColor = colors.primary; ctx.stroke(); ctx.shadowBlur = 0;
            }
            time += 0.02; animationFrameId = requestAnimationFrame(animate);
        };
        animate();
        return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationFrameId); };
    }, [mouse]);
    return (
        <section ref={containerRef} className="h-[320px] sm:h-[450px] md:h-[600px] w-full relative bg-background border-y border-primary/20 flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-100" />
            <div className="relative z-10 text-center px-4 w-full">
                <h2 className="text-3xl sm:text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] select-none">
                    <div className="flex flex-wrap justify-center opacity-90">
                        {"Connecting Developers Globally.".split(" ").map((word, wordIdx, arr) => (
                            <span key={`word-conn-${wordIdx}`} className="inline-flex gap-x-[0.15em] sm:gap-x-[0.2em]">
                                {word.split("").map((c, i) => <InteractiveCharacter key={i} char={c} mouse={mouse} />)}
                                {wordIdx < arr.length - 1 && <InteractiveCharacter char=" " mouse={mouse} />}
                            </span>
                        ))}
                    </div>
                    <div className="flex flex-wrap justify-center text-primary italic">
                        {"the Future".split(" ").map((word, wordIdx, arr) => (
                            <span key={`word-future-${wordIdx}`} className="inline-flex gap-x-[0.15em] sm:gap-x-[0.2em]">
                                {word.split("").map((c, i) => <InteractiveCharacter key={i} char={c} mouse={mouse} />)}
                                {wordIdx < arr.length - 1 && <InteractiveCharacter char=" " mouse={mouse} />}
                            </span>
                        ))}
                    </div>
                </h2>
            </div>
        </section>
    );
};

export const FloatingShowcase = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const mouse = useMotionValue({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouse.set({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouse]);

    // Single array of profiles for the carousel
    const profiles = [
        { name: 'Abhishek', img: '/abhishek_owner.png' },
        { name: 'Priya Sharma', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
        { name: 'Vikram Singh', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80' },
        { name: 'Neha Kapoor', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80' },
        { name: 'Rohan Gupta', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
    ];

    // Carousel auto-play
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % profiles.length);
        }, 1800); // Faster cycle: 1.8 seconds instead of 2.5
        return () => clearInterval(interval);
    }, [profiles.length]);

    // Layout engine for the 5 positions in the carousel
    const getLayout = (relativeIndex) => {
        return {
            0: { x: "-130%", zIndex: 10, rotate: -8, y: 20, scale: 0.8, opacity: 0.3 }, // Far Left
            1: { x: "-65%", zIndex: 15, rotate: -4, y: 10, scale: 0.9, opacity: 0.7 }, // Mid Left
            2: { x: "0%", zIndex: 20, rotate: 0, y: 0, scale: 1.15, opacity: 1 },  // Center (Front)
            3: { x: "65%", zIndex: 15, rotate: 4, y: 10, scale: 0.9, opacity: 0.7 }, // Mid Right
            4: { x: "130%", zIndex: 10, rotate: 8, y: 20, scale: 0.8, opacity: 0.3 }, // Far Right
        }[relativeIndex];
    };

    return (
        <section className="py-10 md:py-24 bg-background relative overflow-hidden">
            <div className="container px-3 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative bg-zinc-950 rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-white/[0.06] shadow-2xl"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.15),transparent_70%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />
                    <div className="absolute -left-20 top-0 w-80 h-80 bg-primary/5 blur-[120px] rounded-full" />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-0 items-center p-6 sm:p-10 md:p-16 lg:p-20 relative z-10">
                        {/* Left */}
                        <div className="space-y-5 md:space-y-8 max-w-lg relative z-10">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white leading-[0.95] select-none">
                                <span className="block">The Elite Talent</span>
                                <span className="block text-primary">era has arrived</span>
                            </h2>
                            <p className="text-sm sm:text-lg text-zinc-400 leading-relaxed max-w-md">
                                From concept to delivery, work with exceptional freelance engineers to build world-class products.
                            </p>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 h-12 md:h-14 px-7 md:px-8 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/30 active:scale-95 transition-transform"
                            >
                                <span>Find your Expert</span>
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </div>

                        {/* Right: Carousel */}
                        <div className="relative flex items-center justify-center h-[260px] sm:h-[320px] md:h-[400px]">
                            {profiles.map((p, i) => {
                                const relativeIndex = (i - activeIndex + profiles.length) % profiles.length;
                                const layout = getLayout(relativeIndex);
                                const isCenter = relativeIndex === 2;
                                return (
                                    <motion.div
                                        key={p.name}
                                        className="absolute top-1/2 left-1/2 -mt-[65px] -ml-[48px] sm:-mt-[80px] sm:-ml-[60px] md:-mt-[92px] md:-ml-[70px] w-[96px] h-[128px] sm:w-[120px] sm:h-[160px] md:w-[140px] md:h-[185px] cursor-pointer"
                                        animate={layout}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                    >
                                        <div className={`relative w-full h-full rounded-xl md:rounded-2xl overflow-hidden border-2 shadow-xl ${isCenter ? 'border-zinc-500 shadow-[0_15px_40px_rgba(0,0,0,0.5)]' : 'border-zinc-800'}`}>
                                            <img src={p.img} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
                                        </div>
                                        <motion.p
                                            animate={{ opacity: isCenter ? 1 : 0, y: isCenter ? 0 : 8 }}
                                            transition={{ duration: 0.4 }}
                                            className="absolute -bottom-6 left-0 right-0 text-center text-xs sm:text-sm text-white font-medium whitespace-nowrap"
                                        >
                                            {p.name}
                                        </motion.p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export const UltraButton = ({ children, primary = false, className = "", ...props }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-60, 60], [25, -25]), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useTransform(x, [-60, 60], [-25, 25]), { stiffness: 300, damping: 30 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - (rect.left + rect.width / 2));
        y.set(e.clientY - (rect.top + rect.height / 2));
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: 1200, rotateX, rotateY }}
            className="relative inline-block"
        >
            <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="relative group cursor-pointer"
            >
                {/* Organic Morphing Shadow Layer */}
                <div className={`absolute -inset-4 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-500 animate-[morph_8s_linear_infinite] ${primary ? 'bg-primary/80' : 'bg-accent/60'}`} />
                
                <Button 
                    {...props}
                    className={`
                        relative h-16 px-12 rounded-3xl text-xl font-black uppercase tracking-[0.2em] overflow-hidden border-0 transition-all duration-500
                        ${primary 
                            ? 'bg-zinc-950 text-white shadow-[0_30px_60px_rgba(0,0,0,0.4)]' 
                            : 'bg-white/5 backdrop-blur-[40px] text-foreground border border-foreground/10'
                        }
                        ${className}
                    `}
                >
                    <span className="relative z-10 block w-full h-full">
                        {/* Interactive Parallax Reflection */}
                        <motion.div 
                            className="absolute -inset-[100%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25),transparent_60%)] pointer-events-none"
                            style={{
                                x: useTransform(x, [-60, 60], [-80, 80]),
                                y: useTransform(y, [-60, 60], [-80, 80]),
                            }}
                        />

                        {/* Floating Content with Z-Offset */}
                        <motion.span 
                            className="relative z-20 flex items-center justify-center gap-3 w-full h-full italic"
                            style={{
                                x: useTransform(x, [-60, 60], [10, -10]),
                                y: useTransform(y, [-60, 60], [10, -10]),
                            }}
                        >
                            {children}
                        </motion.span>
                    </span>
                </Button>
            </motion.div>
        </motion.div>
    );
};



