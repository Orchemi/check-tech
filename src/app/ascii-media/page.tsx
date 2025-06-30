'use client';

import { AsciiMedia } from 'ascii-react';
import { useState, useRef } from 'react';

const video1 = 'https://assets.codepen.io/907471/mouse.mp4';

const Page = () => {
  const [src, setSrc] = useState(video1);

  const [mediaType, setMediaType] = useState<'video' | 'image'>('video');
  const [resolution, setResolution] = useState(96);
  const [fontSize, setFontSize] = useState(8);
  const [charInterval, setCharInterval] = useState(100);
  const [color, setColor] = useState<'auto' | 'mono' | `#${string}`>('auto');
  const [charsRandomLevel, setCharsRandomLevel] = useState<
    'none' | 'group' | 'all'
  >('none');
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);

  const handleRecord = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      alert('캔버스를 찾을 수 없습니다.');
      return;
    }
    const stream = (canvas as HTMLCanvasElement).captureStream(30);
    const recorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 10_000_000,
    });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ascii-canvas.webm';
      a.click();
      setIsRecording(false);
    };

    recorder.start();
    setIsRecording(true);
    recorderRef.current = recorder;

    setTimeout(() => {
      recorder.stop();
    }, 3000); // 3초간 녹화
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <input
        type="text"
        value={src}
        onChange={(e) => setSrc(e.target.value)}
        placeholder="이미지 또는 동영상 URL"
        className="w-96 rounded border px-2 py-1"
      />
      <div className="flex items-center gap-2">
        <button
          className="rounded-md bg-gray-200 px-2 py-1"
          onClick={() => setMediaType('video')}
        >
          <span>Video</span>
        </button>
        <button
          className="rounded-md bg-gray-200 px-2 py-1"
          onClick={() => setMediaType('image')}
        >
          <span>Image</span>
        </button>
      </div>
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
      <div className="flex items-center gap-2">
        <button
          className="rounded-md bg-gray-200 px-2 py-1"
          onClick={() => setColor('auto')}
        >
          <span>Auto</span>
        </button>
        <button
          className="rounded-md bg-gray-200 px-2 py-1"
          onClick={() => setColor('mono')}
        >
          <span>Mono</span>
        </button>
        <button
          className="rounded-md bg-gray-200 px-2 py-1"
          onClick={() => setColor('#000000')}
        >
          <span>#000000</span>
        </button>
        <button
          className="rounded-md bg-gray-200 px-2 py-1"
          onClick={() => setColor('#ffffff')}
        >
          <span>#ffffff</span>
        </button>
        <button
          className="rounded-md bg-gray-200 px-2 py-1"
          onClick={() => setColor('#ff00ff')}
        >
          <span>#ff00ff</span>
        </button>
        <input
          type="text"
          className="rounded-md border border-gray-300 px-2 py-1"
          value={color.startsWith('#') ? color : '#'}
          onChange={(e) => {
            const value = e.target.value;
            if (value.startsWith('#')) {
              setColor(value as `#${string}`);
            }
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="chars-random-level-checkbox">Chars random level:</label>
        <select
          id="chars-random-level-select"
          value={charsRandomLevel}
          onChange={(e) =>
            setCharsRandomLevel(e.target.value as 'none' | 'group' | 'all')
          }
        >
          <option value="none">None</option>
          <option value="group">Group</option>
          <option value="all">All</option>
        </select>
      </div>

      <button
        className="rounded-md bg-blue-500 px-4 py-2 text-white"
        onClick={handleRecord}
        disabled={isRecording}
      >
        {isRecording ? '녹화 중...' : '녹화 시작'}
      </button>

      <AsciiMedia
        src={src}
        mediaType={mediaType}
        resolution={resolution}
        fontSize={fontSize}
        charInterval={charInterval}
        color={color}
        charsRandomLevel={charsRandomLevel}
      />
    </div>
  );
};

export default Page;
