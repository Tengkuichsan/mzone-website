"use client";

import React, { useEffect, useRef } from "react";

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    const particleCount = 70; // Adjust for density
    const connectionDistance = 180;
    
    let scrollY = 0;
    let targetScrollY = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseY: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.baseY = Math.random() * canvas!.height;
        this.y = this.baseY;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
      }

      update(scrollOffset: number) {
        this.x += this.vx;
        this.baseY += this.vy;

        // Apply scroll effect (parallax mapping)
        this.y = this.baseY - scrollOffset * 0.5;

        // Wrap around horizontally
        if (this.x < 0) this.x = canvas!.width;
        if (this.x > canvas!.width) this.x = 0;

        // Wrap around vertically taking scroll into account
        const wrappedHeight = canvas!.height + 200;
        let relativeY = (this.y % wrappedHeight + wrappedHeight) % wrappedHeight;
        
        // We just re-map the visual Y position for rendering
        this.y = relativeY - 100;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(110, 15, 27, 0.4)"; // Maroon color
        ctx.fill();
        
        // Add a subtle glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(110, 15, 27, 0.8)";
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationFrameId: number;

    const animate = () => {
      // Smooth scroll interpolation
      scrollY += (targetScrollY - scrollY) * 0.1;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((p) => {
        p.update(scrollY);
        p.draw();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = 1 - distance / connectionDistance;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(110, 15, 27, ${opacity * 0.4})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.8,
        background: "transparent"
      }}
    />
  );
}
