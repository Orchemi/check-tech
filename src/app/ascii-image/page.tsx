'use client';

import { useEffect, useRef } from 'react';

export default function AsciiImage() {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);

  const charsFixed = [
    '_',
    '.',
    ',',
    '-',
    '=',
    '+',
    ':',
    ';',
    'c',
    'b',
    'a',
    '!',
    '?',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    ['9', '8'],
    ['✚', '✚', '✚', '✚', '✚', '⚛︎'],
    ['☺︎', '☹︎'],
    '☀︎',
    ['@', '#'],
    ['X', 'Y', 'Z'],
    "'",
  ];

  useEffect(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const output = outputRef.current;
    if (!img || !canvas || !output) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvas = () => {
      const { width: w, height: h } = canvas;
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      let outputText = '';

      for (let y = 0; y < h; y++) {
        let row = '';
        for (let x = 0; x < w; x++) {
          const index = (x + y * w) * 4;
          const [r, g, b] = data.slice(index, index + 3);
          const c = (r + g + b) / 3;
          const charIndex = Math.floor(
            (charsFixed.length * ((c * 100) / 255)) / 100,
          );
          const result = charsFixed[charIndex];
          const char = Array.isArray(result)
            ? result[Math.floor(Math.random() * result.length)]
            : result;

          row += `<span style="color: rgb(${r},${g},${b})">${char ?? '&nbsp;'}</span>`;
        }
        outputText += `<div>${row}</div>`;
      }

      output.innerHTML = outputText;
    };

    // 이미지가 로드된 후에만 변환 시작
    img.onload = () => {
      updateCanvas();
    };
  }, []);

  return (
    <div className="grid min-h-screen place-items-center bg-white">
      <div
        ref={outputRef}
        className="overflow-hidden rounded-xl bg-white text-center font-mono whitespace-nowrap text-white"
      />

      <img
        ref={imgRef}
        src="https://exem-homepage-static.s3.ap-northeast-2.amazonaws.com/sample.png"
        alt="ascii"
        crossOrigin="anonymous"
        className="hidden"
      />

      <canvas ref={canvasRef} width="96" height="32" className="hidden" />
    </div>
  );
}
