'use client';

import { useEffect, useRef, useState } from 'react';

export default function AsciiImage() {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [resolution, setResolution] = useState(96);
  const [fontSize, setFontSize] = useState(8);
  const [charInterval, setCharInterval] = useState(100);

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
    if (!img || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const aspect = img.naturalWidth / img.naturalHeight || 3;
    const width = resolution;
    const height = Math.round(width / aspect);
    canvas.width = width * fontSize;
    canvas.height = height * fontSize;

    let animationId: number;

    const drawAscii = () => {
      // 1. 원본 이미지를 작은 해상도로 그리기
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);

      // 2. 픽셀 데이터 추출
      const data = ctx.getImageData(0, 0, width, height).data;

      // 3. canvas를 다시 지우고, 아스키 문자로 덮어쓰기
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
      ctx.font = `${fontSize}px monospace`;

      let i = 0;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++, i++) {
          const idx = (x + y * width) * 4;
          const [r, g, b] = data.slice(idx, idx + 3);
          const charRaw =
            charsFixed[Math.floor(Math.random() * charsFixed.length)];
          const char = Array.isArray(charRaw) ? charRaw[0] : charRaw;
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillText(char ?? ' ', x * fontSize, y * fontSize);
        }
      }
      animationId = window.setTimeout(drawAscii, charInterval);
    };

    img.onload = () => {
      drawAscii();
    };
    if (img.complete) drawAscii();

    return () => {
      clearTimeout(animationId);
    };
  }, [resolution, fontSize, charInterval]);

  return (
    <div className="grid min-h-screen place-items-center">
      <div className="mb-4 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <label htmlFor="resolution-slider">Resolution:</label>
          <input
            id="resolution-slider"
            type="range"
            min={24}
            max={192}
            value={resolution}
            onChange={(e) => setResolution(Number(e.target.value))}
          />
          <span>{resolution}px</span>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="font-size-slider">Font size:</label>
          <input
            id="font-size-slider"
            type="range"
            min={4}
            max={24}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
          <span>{fontSize}px</span>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="interval-slider">Interval(ms):</label>
          <input
            id="interval-slider"
            type="range"
            min={16}
            max={500}
            value={charInterval}
            onChange={(e) => setCharInterval(Number(e.target.value))}
          />
          <span>{charInterval}ms</span>
        </div>
      </div>
      <canvas ref={canvasRef} />
      <img
        ref={imgRef}
        src="https://exem-homepage-static.s3.ap-northeast-2.amazonaws.com/sample.png"
        alt="ascii"
        crossOrigin="anonymous"
        className="hidden"
      />
    </div>
  );
}
