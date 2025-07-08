import { useRef, useState, useEffect } from 'react';

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    hex.replace('#', ''),
  );
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

export default function useAsciiColorTransition({
  startColor,
  endColor,
  duration,
  onUpdate,
}: {
  startColor: string;
  endColor: string;
  duration: number;
  onUpdate: (color: string) => void;
}) {
  const [isRunning, setIsRunning] = useState(false);
  const rafRef = useRef<number | null>(null);

  function startGradient() {
    if (isRunning) return;
    setIsRunning(true);
    const start = hexToRgb(startColor);
    const end = hexToRgb(endColor);
    const startTime = performance.now();
    const totalMs = duration * 1000;

    function step(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / totalMs, 1);
      const r = Math.round(start[0] + (end[0] - start[0]) * t);
      const g = Math.round(start[1] + (end[1] - start[1]) * t);
      const b = Math.round(start[2] + (end[2] - start[2]) * t);
      const color = rgbToHex(r, g, b);
      onUpdate(color);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setIsRunning(false);
      }
    }
    rafRef.current = requestAnimationFrame(step);
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return { startGradient, isRunning };
}
