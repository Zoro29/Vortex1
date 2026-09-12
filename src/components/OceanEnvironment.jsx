import { useEffect, useRef } from "react";

/**
 * The water itself: rising marine snow and bubbles on a single 2D canvas.
 *
 * One canvas and one animation frame for every particle. Doing this with DOM
 * nodes would mean hundreds of composited layers and a repaint storm on scroll.
 *
 * `depthRef` carries scroll depth as 0..1 and is read, never subscribed to, so
 * scrolling never re-renders React.
 */
export default function OceanEnvironment({ depthRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { alpha: true });

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let particles = [];

    const random = (min, max) => min + Math.random() * (max - min);

    const spawn = (initial) => ({
      x: random(0, width),
      y: initial ? random(0, height) : height + random(10, 120),
      // Bubbles are the minority: mostly it is marine snow drifting past.
      bubble: Math.random() < 0.22,
      radius: random(0.7, 2.6),
      speed: random(12, 46),
      // Horizontal wobble, so nothing travels in a dead straight line.
      phase: random(0, Math.PI * 2),
      sway: random(4, 16),
      alpha: random(0.16, 0.6),
    });

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Scale the population to the viewport instead of hard-coding a count.
      const target = Math.round(Math.min(190, (width * height) / 9000));
      particles = Array.from({ length: target }, () => spawn(true));
    };

    resize();

    let last = performance.now();

    const draw = (now) => {
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;

      const depth = depthRef.current ?? 0;
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        particle.y -= particle.speed * delta;
        particle.phase += delta * 1.2;

        if (particle.y < -20) Object.assign(particle, spawn(false));

        const x = particle.x + Math.sin(particle.phase) * particle.sway;
        // Everything dims with depth, but bubbles keep a little more of their
        // highlight so they stay readable in the dark.
        const fade = particle.bubble ? 0.45 + (1 - depth) * 0.55 : 0.25 + (1 - depth) * 0.75;

        context.beginPath();
        context.arc(x, particle.y, particle.radius, 0, Math.PI * 2);

        if (particle.bubble) {
          context.strokeStyle = `rgba(226, 244, 255, ${particle.alpha * fade})`;
          context.lineWidth = 1;
          context.stroke();
        } else {
          context.fillStyle = `rgba(214, 236, 248, ${particle.alpha * fade * 0.8})`;
          context.fill();
        }
      }

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [depthRef]);

  return <canvas className="ocean-particles" ref={canvasRef} aria-hidden="true" />;
}
