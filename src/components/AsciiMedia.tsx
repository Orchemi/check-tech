import { useEffect, useRef, useCallback } from 'react';

interface AsciiMediaProps {
  src: string;
  mediaType: 'image' | 'video';
  resolution?: number;
  fontSize?: number;
  charInterval?: number;
  colored?: boolean;
  charsRandomLevel?: 'none' | 'group' | 'all';
  charList?: string[];
  charMatrix?: string[][];
}

const _charList: string[] = [
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
];

const _charMatrix: string[][] = [
  [' '],
  ['.', ',', "'", '`', '"', ':', ';', '-', '_', '`', '·', '˙', 'ˑ', ':', '˘'],
  ['^', ':', ';', '!', '|', '/', '\\', '(', ')', '[', ']', '{', '}', '<', '>'],
  [
    '-',
    '_',
    '+',
    '~',
    '=',
    '*',
    '?',
    'i',
    'l',
    'I',
    'j',
    'r',
    't',
    'f',
    'x',
    'n',
    'u',
    'v',
    'c',
    'z',
  ],
  [
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
    'S',
    'V',
    'A',
    'E',
    'F',
    'T',
    'P',
    'G',
  ],
  [
    '*',
    '#',
    'M',
    'W',
    '&',
    '8',
    '%',
    'B',
    '$',
    '@',
    '§',
    '¤',
    '£',
    '¥',
    '©',
    '®',
    '¶',
    'µ',
    'ß',
    'Ø',
    'Þ',
    'Ð',
    'þ',
    'æ',
    'œ',
    'Ω',
    'δ',
    'Φ',
    'Ψ',
    'Σ',
    'Ξ',
  ],
  ['@', '$', '#'],
];

export default function AsciiMedia(props: AsciiMediaProps) {
  const {
    src,
    mediaType,
    resolution = 96,
    fontSize = 8,
    charInterval = 100,
    colored = true,
    charsRandomLevel = 'none',
    charList = _charList,
    charMatrix = _charMatrix,
  } = props;

  const imgRef = useRef<HTMLImageElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationId = useRef<number | null>(null);

  const drawAscii = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = resolution,
      h = resolution;
    let ready = false;

    if (mediaType === 'image') {
      const img = imgRef.current;
      if (!img || !img.naturalWidth) {
        animationId.current = window.setTimeout(drawAscii, charInterval);
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
      animationId.current = window.setTimeout(drawAscii, charInterval);
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
        let char = ' ';
        if (charsRandomLevel === 'none') {
          const charIndex = Math.floor(
            (1 - brightnessNorm) * (charList.length - 1),
          );
          char = charList[charIndex];
        } else if (charsRandomLevel === 'group') {
          const groupIndex = Math.floor(
            (1 - brightnessNorm) * (charMatrix.length - 1),
          );
          const group = charMatrix[groupIndex];
          char = group[Math.floor(Math.random() * group.length)];
        } else {
          char = charList[Math.floor(Math.random() * charList.length)];
        }
        if (colored) {
          ctx.fillStyle = `rgb(${r},${g},${b})`;
        } else {
          ctx.fillStyle = `rgb(${brightness},${brightness},${brightness})`;
        }
        ctx.fillText(char ?? ' ', x * fontSize, y * fontSize);
      }
    }
    animationId.current = window.setTimeout(drawAscii, charInterval);
  }, [
    src,
    mediaType,
    resolution,
    fontSize,
    charInterval,
    colored,
    charsRandomLevel,
    charList,
    charMatrix,
  ]);

  useEffect(() => {
    const img = imgRef.current;
    const video = videoRef.current;

    if (mediaType === 'image' && img) {
      img.onload = () => drawAscii();
      if (img.complete) drawAscii();
    } else if (mediaType === 'video' && video) {
      video.onloadeddata = () => {
        video.play();
        drawAscii();
      };
      if (video.readyState >= 2) {
        video.play();
        drawAscii();
      }
    } else {
      drawAscii();
    }

    return () => {
      if (animationId.current) clearTimeout(animationId.current);
      if (img) img.onload = null;
      if (video) video.onloadeddata = null;
    };
  }, [drawAscii, mediaType]);

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
