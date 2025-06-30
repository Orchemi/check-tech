'use client';

import { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

const slides = ['🍎', '🍊', '🍌', '🍇', '🍉', '🍍'];

export default function CarouselPage() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);

  const updateVisible = useCallback(() => {
    if (!emblaApi) return;
    const inView = emblaApi.slidesInView();
    console.log(inView);
    setVisibleIndexes(inView);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', updateVisible);
    emblaApi.on('init', updateVisible);
    emblaApi.on('reInit', updateVisible);
  }, [emblaApi, updateVisible]);

  const isEdgeItem = useCallback(
    (index: number) => {
      if (visibleIndexes.length === 0) return false;
      return (
        index === visibleIndexes[0] ||
        index === visibleIndexes[visibleIndexes.length - 1]
      );
    },
    [visibleIndexes],
  );

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">🍒 Custom Carousel</h1>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-x">
          {slides.map((emoji, index) => (
            <div
              key={index}
              className={`mx-2 flex h-40 flex-[0_0_60%] items-center justify-center rounded-xl text-6xl transition-opacity duration-300 ${
                isEdgeItem(index) ? 'opacity-50' : 'opacity-100'
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
}
