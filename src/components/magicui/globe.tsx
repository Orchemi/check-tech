'use client';

import createGlobe, { COBEOptions } from 'cobe';
import { useMotionValue, useSpring } from 'motion/react';
import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';
import { GlobeCategory } from '@/app/magic-ui/globe/page';

const MOVEMENT_DAMPING = 1400;

// ref: https://cobe.vercel.app/docs/api
const BASE_GLOBE_CONFIG: Partial<COBEOptions> = {
  width: 1200,
  height: 1200,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0, // rotation around the vertical axis
  theta: 0.3, // rotation around the horizontal axis
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [58 / 255, 210 / 255, 230 / 255],
  glowColor: [1, 1, 1],
  markers: [],
};

const GLOBE_CONFIG: Record<GlobeCategory, COBEOptions> = {
  government: {
    ...BASE_GLOBE_CONFIG,
    markers: [
      {
        name: 'USA',
        latitude: 40.7128,
        longitude: -74.006,
        size: 0.1,
      },
      {
        name: 'Japan',
        latitude: 34.6937,
        longitude: 135.5022,
        size: 0.05,
      },
      {
        name: 'Turkey',
        latitude: 41.0082,
        longitude: 28.9784,
        size: 0.06,
      },
    ].map((country) => ({
      location: [country.latitude, country.longitude],
      size: country.size,
    })),
  } as COBEOptions,
  public: {
    ...BASE_GLOBE_CONFIG,
    markers: [
      {
        name: 'Philippines',
        latitude: 14.5995,
        longitude: 120.9842,
        size: 0.03,
      },
      {
        name: 'India',
        latitude: 19.076,
        longitude: 72.8777,
        size: 0.1,
      },
      {
        name: 'Bangladesh',
        latitude: 23.8103,
        longitude: 90.4125,
        size: 0.05,
      },
    ].map((country) => ({
      location: [country.latitude, country.longitude],
      size: country.size,
    })),
  } as COBEOptions,
  commerce: {
    ...BASE_GLOBE_CONFIG,
    markers: [
      {
        name: 'Philippines',
        latitude: 14.5995,
        longitude: 120.9842,
        size: 0.03,
      },
      {
        name: 'India',
        latitude: 19.076,
        longitude: 72.8777,
        size: 0.1,
      },
      {
        name: 'Bangladesh',
        latitude: 23.8103,
        longitude: 90.4125,
        size: 0.05,
      },
      {
        name: 'Egypt',
        latitude: 30.0444,
        longitude: 31.2357,
        size: 0.07,
      },
      {
        name: 'China',
        latitude: 39.9042,
        longitude: 116.4074,
        size: 0.08,
      },
      {
        name: 'Brazil',
        latitude: -23.5505,
        longitude: -46.6333,
        size: 0.1,
      },
      {
        name: 'Mexico',
        latitude: 19.4326,
        longitude: -99.1332,
        size: 0.1,
      },
      {
        name: 'USA',
        latitude: 40.7128,
        longitude: -74.006,
        size: 0.1,
      },
      {
        name: 'Japan',
        latitude: 34.6937,
        longitude: 135.5022,
        size: 0.05,
      },
      {
        name: 'Turkey',
        latitude: 41.0082,
        longitude: 28.9784,
        size: 0.06,
      },
    ].map((country) => ({
      location: [country.latitude, country.longitude],
      size: country.size,
    })),
  } as COBEOptions,
};

// 기본 자동 회전 속도
const DEFAULT_AUTO_ROTATE_SPEED = 0.005;

export function Globe({
  className,
  initialPhi = 0,
  autoRotateSpeed = DEFAULT_AUTO_ROTATE_SPEED,
  category,
}: {
  category: GlobeCategory;
  className?: string;
  initialPhi?: number;
  autoRotateSpeed?: number;
}) {
  const phi = useRef(initialPhi);
  let width = 0;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const config = GLOBE_CONFIG[category];

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });

  const autoRotateSpeedRef = useRef(autoRotateSpeed);
  useEffect(() => {
    autoRotateSpeedRef.current = autoRotateSpeed;
  }, [autoRotateSpeed]);

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? 'grabbing' : 'grab';
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };

    window.addEventListener('resize', onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: width * 2,
      height: width * 2,
      onRender: (state) => {
        if (!pointerInteracting.current)
          phi.current += autoRotateSpeedRef.current;
        state.phi = phi.current + rs.get();
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => (canvasRef.current!.style.opacity = '1'), 0);
    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, [rs, config]);

  return (
    <div
      className={cn(
        'absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[800px]',
        className,
      )}
    >
      <canvas
        className={cn(
          'size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]',
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  );
}
