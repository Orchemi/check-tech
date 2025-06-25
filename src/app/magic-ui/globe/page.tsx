'use client';

import { cn } from '@/lib/utils';
import { Globe } from '@/components/magicui/globe';
import { useState, useRef } from 'react';

export type GlobeCategory = 'government' | 'public' | 'commerce';

export default function GlobePage() {
  const [selectedCategory, setSelectedCategory] =
    useState<GlobeCategory>('government');
  const [autoRotateSpeed, setAutoRotateSpeed] = useState(0.005);
  const animationRef = useRef<number | null>(null);
  const animationStartRef = useRef<number>(0);
  const DURATION = 1000; // 1초
  const SPEED_MIN = 0.005;
  const SPEED_MAX = 0.1;

  function easeInOutSine(t: number) {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  }

  const animateSpeed = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationStartRef.current = Date.now();
    function step() {
      const elapsed = Date.now() - animationStartRef.current;
      const t = Math.min(elapsed / DURATION, 1);
      // progress: 0→1→0
      const progress =
        t < 0.5
          ? easeInOutSine(t * 2) // 0~0.5: 0→1
          : easeInOutSine(2 - t * 2); // 0.5~1: 1→0
      const speed = SPEED_MIN + (SPEED_MAX - SPEED_MIN) * progress;
      setAutoRotateSpeed(speed);
      if (t < 1) {
        animationRef.current = requestAnimationFrame(step);
      } else {
        setAutoRotateSpeed(SPEED_MIN);
        animationRef.current = null;
      }
    }
    step();
  };

  const handleCategoryChange = (category: GlobeCategory) => {
    setSelectedCategory(category);
    animateSpeed();
  };

  return (
    <div
      className={cn(
        'flex h-screen flex-col items-center justify-center px-4 py-10',
      )}
    >
      <div className="flex gap-2">
        {(['government', 'public', 'commerce'] as GlobeCategory[]).map(
          (category) => (
            <button
              key={category}
              className={cn(
                'rounded-md border border-gray-300 px-4 py-2',
                selectedCategory === category && 'bg-blue-500 text-white',
              )}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ),
        )}
      </div>
      <div className="relative h-full w-full flex-1">
        <Globe category={selectedCategory} autoRotateSpeed={autoRotateSpeed} />
      </div>
    </div>
  );
}
