'use client';

import { useEffect, useRef, useState } from 'react';

export default function AsciiImage() {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);

  const [resolution, setResolution] = useState(96); // 해상도(가로 픽셀 수)
  const [spanWidth, setSpanWidth] = useState(8); // 가로 간격
  const [lineHeight, setLineHeight] = useState(0.8); // 세로 간격
  const [charFrame, setCharFrame] = useState(0); // 문자 로테이션 인덱스

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

    // 해상도에 따라 canvas 크기 조정
    const aspect = img.naturalWidth / img.naturalHeight || 3;
    const width = resolution;
    const height = Math.round(width / aspect);
    canvas.width = width;
    canvas.height = height;

    let animationId: number;

    const updateCanvas = () => {
      ctx.drawImage(img, 0, 0, width, height);
      const data = ctx.getImageData(0, 0, width, height).data;
      let outputText = '';

      let i = 0;
      for (let y = 0; y < height; y++) {
        let row = '';
        for (let x = 0; x < width; x++) {
          const index = (x + y * width) * 4;
          const [r, g, b] = data.slice(index, index + 3);
          // 완전 랜덤하게 문자 선택
          const charRaw =
            charsFixed[Math.floor(Math.random() * charsFixed.length)];
          const char = Array.isArray(charRaw) ? charRaw[0] : charRaw;
          row += `<span style="color: rgb(${r},${g},${b}); font-size: 8px; display:inline-block; width:${spanWidth}px">${char ?? '&nbsp;'}</span>`;
        }
        outputText += `<div style="line-height: ${lineHeight}">${row}</div>`;
      }

      output.innerHTML = outputText;
      animationId = window.setTimeout(updateCanvas, 100); // 100ms마다 갱신
    };

    img.onload = () => {
      updateCanvas();
    };
    if (img.complete) updateCanvas();

    return () => {
      clearTimeout(animationId);
    };
  }, [resolution, spanWidth, lineHeight]);

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
          <label htmlFor="span-width-slider">Horizontal (span width):</label>
          <input
            id="span-width-slider"
            type="range"
            min={4}
            max={24}
            value={spanWidth}
            onChange={(e) => setSpanWidth(Number(e.target.value))}
          />
          <span>{spanWidth}px</span>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="line-height-slider">Vertical (line-height):</label>
          <input
            id="line-height-slider"
            type="range"
            min={0}
            max={2}
            step={0.01}
            value={lineHeight}
            onChange={(e) => setLineHeight(Number(e.target.value))}
          />
          <span>{lineHeight}</span>
        </div>
      </div>
      <div
        ref={outputRef}
        className="overflow-hidden rounded-xl bg-black text-center font-mono whitespace-nowrap text-white"
      />

      <img
        ref={imgRef}
        src="https://exem-homepage-static.s3.ap-northeast-2.amazonaws.com/sample.png"
        alt="ascii"
        crossOrigin="anonymous"
        className="hidden"
      />

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
