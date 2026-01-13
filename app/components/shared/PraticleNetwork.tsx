"use client";

import { useEffect, useRef } from "react";

export function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let mouse = { x: -100, y: -100 };

    // CONFIGURATION
    const PARTICLE_COUNT = 70; // High for Desktop
    const CONNECT_DISTANCE = 150; // Distance to snap lines
    const MOUSE_RANGE = 200; // Radius of mouse influence

    // Handle Resize
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // Track Mouse
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.5; // Velocity X
        this.vy = (Math.random() - 0.5) * 0.5; // Velocity Y
        this.size = Math.random() * 2 + 1;
      }

      update() {
        // Move
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;

        // Mouse Interaction (The "Magnetic" Effect)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < MOUSE_RANGE) {
          // Gently push away slightly to create "ripple"
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (MOUSE_RANGE - distance) / MOUSE_RANGE;
          // You can change to += to ATTRACT instead of REPEL
          this.vx -= forceDirectionX * force * 0.05;
          this.vy -= forceDirectionY * force * 0.05;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = "rgba(6, 182, 212, 0.5)"; // Cyan Nodes
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and Draw Particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Connect Particles (The "Neural" Lines)
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CONNECT_DISTANCE) {
            ctx.beginPath();
            // Opacity depends on distance (Fades out smoothly)
            const opacity = 1 - distance / CONNECT_DISTANCE;
            ctx.strokeStyle = `rgba(6, 182, 212, ${opacity * 0.2})`; // Cyan Lines
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
        
        // Connect to Mouse (The "Interactive" Lines)
        const dx = mouse.x - particles[i].x;
        const dy = mouse.y - particles[i].y;
        const distMouse = Math.sqrt(dx * dx + dy * dy);
        
        if (distMouse < MOUSE_RANGE) {
           ctx.beginPath();
           const opacity = 1 - distMouse / MOUSE_RANGE;
           ctx.strokeStyle = `rgba(6, 182, 212, ${opacity * 0.5})`; // Brighter interaction lines
           ctx.lineWidth = 2;
           ctx.moveTo(particles[i].x, particles[i].y);
           ctx.lineTo(mouse.x, mouse.y);
           ctx.stroke();
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-60"
    />
  );
}