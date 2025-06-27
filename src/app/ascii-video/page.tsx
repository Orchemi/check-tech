'use client';

import { useEffect, useRef } from 'react';

export default function AsciiVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
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
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const output = outputRef.current;
    if (!video || !canvas || !output) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let chars = [...charsFixed];
    let charsLength = chars.length;
    const MAX_COLOR_INDEX = 255;

    const updateCanvas = () => {
      const { width: w, height: h } = canvas;
      ctx.drawImage(video, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      let outputText = '';

      for (let y = 0; y < h; y++) {
        let row = '';
        for (let x = 0; x < w; x++) {
          const index = (x + y * w) * 4;
          const [r, g, b] = data.slice(index, index + 3);
          const c = (r + g + b) / 3;
          const charIndex = Math.floor(
            (charsLength * ((c * 100) / MAX_COLOR_INDEX)) / 100,
          );
          const result = chars[charIndex];
          const char = Array.isArray(result)
            ? result[Math.floor(Math.random() * result.length)]
            : result;

          row += `<span style="color: rgb(${r},${g},${b})">${char ?? '&nbsp;'}</span>`;
        }
        outputText += `<div>${row}</div>`;
      }

      output.innerHTML = outputText;
      requestAnimationFrame(updateCanvas);
    };

    video.play();
    updateCanvas();
  }, []);

  return (
    <div className="grid min-h-screen place-items-center bg-white">
      <div
        ref={outputRef}
        className="overflow-hidden rounded-xl bg-white text-center font-mono whitespace-nowrap text-white"
      />

      <video
        ref={videoRef}
        src={
          'https://exem-homepage-static.s3.ap-northeast-2.amazonaws.com/swedish-flag-short.mp4'
        }
        autoPlay
        muted
        loop
        playsInline
        crossOrigin="anonymous"
        className="hidden"
      />

      <canvas ref={canvasRef} width="96" height="32" className="hidden" />
    </div>
  );
}
