'use client';

import { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

const slides = ['🍎', '🍊', '🍌', '🍇', '🍉', '🍍'];

const EmblaCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);

  const updateVisible = useCallback(
    (trigger: string) => {
      if (!emblaApi) return;
      console.log(trigger);
      const inView = emblaApi.slidesInView();
      setVisibleIndexes(inView);
    },
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('init', () => updateVisible('init'));
    emblaApi.on('init', () => updateVisible('init'));
    emblaApi.on('settle', () => updateVisible('settle'));
    emblaApi.on('select', () => updateVisible('select'));
    emblaApi.on('scroll', () => updateVisible('scroll'));
  }, [emblaApi]);

  const isEdgeItem = useCallback(
    (index: number) => {
      if (visibleIndexes.length === 0) return false;
      return (
        index === visibleIndexes[0]
        // index === visibleIndexes[visibleIndexes.length - 1]
      );
    },
    [visibleIndexes],
  );

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-x">
          {[...slides, ...slides].map((emoji, index) => (
            <div
              key={index}
              className={`mx-2 flex h-40 flex-[0_0_20%] items-center justify-center rounded-xl text-6xl transition-opacity duration-200 ${
                isEdgeItem(index) ? 'opacity-20' : 'opacity-100'
              } bg-pink-100`}
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={scrollPrev}
          className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
        >
          Prev
        </button>
        <button
          onClick={scrollNext}
          className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmblaCarousel;
