import { useEffect, useRef } from 'react';

const DEFAULT_CHARS = [
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
  '8',
  '9',
  '✚',
  '⚛︎',
  '☺︎',
  '☹︎',
  '☀︎',
  '@',
  '#',
  'X',
  'Y',
  'Z',
  "'",
];

interface AsciiMediaProps {
  src: string;
  mediaType: 'image' | 'video';
  resolution?: number;
  fontSize?: number;
  charInterval?: number;
  chars?: string[];
  colored?: boolean;
}

export default function AsciiMedia({
  src,
  mediaType,
  resolution = 96,
  fontSize = 8,
  charInterval = 100,
  chars = [
    ' ',
    '.',
    "'",
    '`',
    '^',
    '"',
    ',',
    ':',
    ';',
    '!',
    'i',
    'l',
    'I',
    '>',
    '<',
    '~',
    '+',
    '_',
    '-',
    '?',
    ']',
    '[',
    '}',
    '{',
    '1',
    ')',
    '(',
    '|',
    '\\',
    '/',
    't',
    'f',
    'j',
    'r',
    'x',
    'n',
    'u',
    'v',
    'c',
    'z',
    'X',
    'Y',
    'U',
    'J',
    'C',
    'L',
    'Q',
    '0',
    'O',
    'Z',
    'm',
    'w',
    'q',
    'p',
    'd',
    'b',
    'k',
    'h',
    'a',
    'o',
    '*',
    '#',
    'M',
    'W',
    '&',
    '8',
    '%',
    'B',
    '@',
    '$',
  ],
  colored = true,
}: AsciiMediaProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = resolution;
    let height = resolution;

    const drawAscii = () => {
      let w = width,
        h = height;
      let ready = false;

      if (mediaType === 'image') {
        const img = imgRef.current;
        if (!img || !img.naturalWidth) {
          animationId = window.setTimeout(drawAscii, charInterval);
          return;
        }
        const aspect = img.naturalWidth / img.naturalHeight || 3;
        w = resolution;
        h = Math.round(w / aspect);
        canvas.width = w * fontSize;
        canvas.height = h * fontSize;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, w, h);
        ready = true;
      } else if (mediaType === 'video') {
        const video = videoRef.current;
        if (!video || !video.videoWidth || video.paused || video.ended) return;
        const aspect = video.videoWidth / video.videoHeight || 3;
        w = resolution;
        h = Math.round(w / aspect);
        canvas.width = w * fontSize;
        canvas.height = h * fontSize;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, w, h);
        ready = true;
      }

      if (!ready) {
        animationId = window.setTimeout(drawAscii, charInterval);
        return;
      }

      const data = ctx.getImageData(0, 0, w, h).data;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
      ctx.font = `${fontSize}px monospace`;

      let i = 0;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++, i++) {
          const idx = (x + y * w) * 4;
          const [r, g, b] = data.slice(idx, idx + 3);
          const brightness = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
          const brightnessNorm = brightness / 255;
          const charIndex = Math.floor(
            (1 - brightnessNorm) * (chars.length - 1),
          );
          const char = chars[charIndex];
          if (colored) {
            ctx.fillStyle = `rgb(${r},${g},${b})`;
          } else {
            ctx.fillStyle = `rgb(${brightness},${brightness},${brightness})`;
          }
          ctx.fillText(char ?? ' ', x * fontSize, y * fontSize);
        }
      }
      if (mediaType === 'video') {
        animationId = window.setTimeout(drawAscii, charInterval);
      }
    };

    if (mediaType === 'image') {
      const img = imgRef.current;
      if (img) {
        img.onload = () => drawAscii();
        if (img.complete) drawAscii();
      }
    } else if (mediaType === 'video') {
      const video = videoRef.current;
      if (video) {
        video.load();
        video.onloadeddata = () => {
          video.play();
          drawAscii();
        };
        video.onplay = () => drawAscii();
        video.onpause = () => clearTimeout(animationId);
        video.onended = () => clearTimeout(animationId);
        if (!video.paused && !video.ended) drawAscii();
      }
    }

    return () => {
      clearTimeout(animationId);
    };
  }, [src, mediaType, resolution, fontSize, charInterval, colored]);

  if (src === '') return null;

  return (
    <>
      <canvas ref={canvasRef} />
      {mediaType === 'image' && (
        <img
          ref={imgRef}
          src={src}
          alt="ascii"
          crossOrigin="anonymous"
          className="hidden"
        />
      )}
      {mediaType === 'video' && (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          crossOrigin="anonymous"
          className="hidden"
        />
      )}
    </>
  );
}
