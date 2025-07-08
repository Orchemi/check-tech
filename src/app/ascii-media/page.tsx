'use client';

import { AsciiMedia, HexColor, ManualCharColor } from 'ascii-react';
import { useState, useRef, useEffect } from 'react';
import { Separator } from '@/components/ui';
import AsciiMediaTypeSection from './_components/sidebar/AsciiMediaTypeSection';
import AsciiFileUploadSection from './_components/sidebar/AsciiFileUploadSection';
import AsciiMediaUrlSection from './_components/sidebar/AsciiMediaUrlSection';
import AsciiResolutionSection from './_components/sidebar/AsciiResolutionSection';
import AsciiManualCharColorSection from './_components/sidebar/AsciiManualCharColorSection';
import AsciiCharsRandomLevelSection from './_components/sidebar/AsciiCharsRandomLevelSection';
import AsciiInvertSection from './_components/sidebar/AsciiInvertSection';
import AsciiBackgroundSection from './_components/sidebar/AsciiBackgroundSection';
import AsciiIgnoreBrightSection from './_components/sidebar/AsciiIgnoreBrightSection';
import AsciiRecordSection from './_components/sidebar/AsciiRecordSection';
import AsciiRecordButtonSection from './_components/sidebar/AsciiRecordButtonSection';
import AsciiColorSection from './_components/sidebar/AsciiColorSection';

const video1 = 'https://assets.codepen.io/907471/mouse.mp4';

const Page = () => {
  const [src, setSrc] = useState(video1);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

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
  const [backgroundColor, setBackgroundColor] = useState<HexColor>('#ffffff');
  const [recordTime, setRecordTime] = useState(5); // seconds
  const [recordFormat, setRecordFormat] = useState<'webm' | 'mp4'>('webm');
  const [quality, setQuality] = useState(10_000_000); // bps, default 10Mbps
  const [ignoreBright, setIgnoreBright] = useState(0); // 0~1
  const [invert, setInvert] = useState(false);
  const [manualCharColors, setManualCharColors] = useState<ManualCharColor[]>([
    { char: '', color: '#000000' },
  ]);

  const handleCharChange = (idx: number, value: string) => {
    setManualCharColors((arr) =>
      arr.map((item, i) =>
        i === idx ? { ...item, char: value.slice(0, 1) } : item,
      ),
    );
  };
  const handleColorChange = (idx: number, value: string) => {
    setManualCharColors((arr) =>
      arr.map((item, i) =>
        i === idx ? { ...item, color: value as `#${string}` } : item,
      ),
    );
  };
  const handleAddCharColor = () => {
    setManualCharColors((arr) => [...arr, { char: '', color: '#000000' }]);
  };
  const handleRemoveCharColor = (idx: number) => {
    setManualCharColors((arr) =>
      arr.length > 1 ? arr.filter((_, i) => i !== idx) : arr,
    );
  };

  // Hex input handler for manualCharColors
  const handleHexInputChange = (idx: number, value: string) => {
    // Only allow # and up to 8 hex digits
    if (/^#[0-9a-fA-F]{0,8}$/.test(value)) {
      setManualCharColors((arr) =>
        arr.map((item, i) =>
          i === idx ? { ...item, color: value as `#${string}` } : item,
        ),
      );
    }
  };

  // Clean up Blob URL on unmount or when new file is selected
  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  const handleRecord = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      alert('캔버스를 찾을 수 없습니다.');
      return;
    }
    const stream = (canvas as HTMLCanvasElement).captureStream(30);
    let mimeType = 'video/webm;codecs=vp9';
    let fileExt = 'webm';
    if (recordFormat === 'mp4') {
      mimeType = 'video/mp4';
      fileExt = 'mp4';
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      alert(
        `${recordFormat.toUpperCase()} 포맷은 이 브라우저에서 지원되지 않습니다.`,
      );
      return;
    }
    const videoBitsPerSecond = quality;
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond,
    });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ascii-canvas.${fileExt}`;
      a.click();
      setIsRecording(false);
    };

    recorder.start();
    setIsRecording(true);
    recorderRef.current = recorder;

    setTimeout(() => {
      recorder.stop();
    }, recordTime * 1000); // 사용자가 지정한 초만큼 녹화
  };

  return (
    <div className="relative flex min-h-screen">
      {/* 메인 영역: AsciiMedia 중앙 정렬 */}
      <div className="flex flex-1 items-center justify-center">
        <div style={{ backgroundColor }}>
          <AsciiMedia
            src={src}
            mediaType={mediaType}
            resolution={resolution}
            fontSize={fontSize}
            charInterval={charInterval}
            color={color}
            charsRandomLevel={charsRandomLevel}
            backgroundColor={backgroundColor}
            ignoreBright={ignoreBright}
            invert={invert}
            manualCharColors={manualCharColors}
          />
        </div>
        <canvas style={{ display: 'none' }} />
      </div>

      {/* 오른쪽 사이드바 (설정 패널) 항상 표시 */}
      <div className="w-[360px]" />

      <aside className="fixed top-0 right-0 z-20 flex h-full w-[360px] flex-col border-l bg-white shadow-lg">
        <div className="border-b px-6 py-3 text-lg font-bold">설정</div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <AsciiFileUploadSection
            fileUrl={fileUrl}
            setFileUrl={setFileUrl}
            setSrc={setSrc}
          />
          <Separator className="my-4" />
          <AsciiMediaUrlSection src={src} setSrc={setSrc} />
          <Separator className="my-4" />

          <AsciiMediaTypeSection
            mediaType={mediaType}
            setMediaType={setMediaType}
          />
          <Separator className="my-4" />
          <AsciiResolutionSection
            resolution={resolution}
            setResolution={setResolution}
            fontSize={fontSize}
            setFontSize={setFontSize}
            charInterval={charInterval}
            setCharInterval={setCharInterval}
          />
          <Separator className="my-4" />

          <AsciiColorSection color={color} setColor={setColor} />
          <Separator className="my-4" />

          <AsciiManualCharColorSection
            manualCharColors={manualCharColors}
            setManualCharColors={setManualCharColors}
            handleCharChange={handleCharChange}
            handleColorChange={handleColorChange}
            handleHexInputChange={handleHexInputChange}
            handleAddCharColor={handleAddCharColor}
            handleRemoveCharColor={handleRemoveCharColor}
          />
          <Separator className="my-4" />
          <AsciiCharsRandomLevelSection
            charsRandomLevel={charsRandomLevel}
            setCharsRandomLevel={setCharsRandomLevel}
          />
          <Separator className="my-4" />
          <AsciiInvertSection invert={invert} setInvert={setInvert} />
          <Separator className="my-4" />
          <AsciiBackgroundSection
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
          />
          <Separator className="my-4" />
          <AsciiIgnoreBrightSection
            ignoreBright={ignoreBright}
            setIgnoreBright={setIgnoreBright}
          />
          <Separator className="my-4" />
          <AsciiRecordSection
            recordTime={recordTime}
            setRecordTime={setRecordTime}
            recordFormat={recordFormat}
            setRecordFormat={setRecordFormat}
            quality={quality}
            setQuality={setQuality}
          />
          <Separator className="my-4" />
          <AsciiRecordButtonSection
            isRecording={isRecording}
            handleRecord={handleRecord}
          />
        </div>
      </aside>
    </div>
  );
};

export default Page;
