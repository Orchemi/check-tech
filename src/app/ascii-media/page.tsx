'use client';

import {
  AsciiMedia,
  CharsRandomLevel,
  HexColor,
  ManualCharColor,
} from 'ascii-react';
import { useState, useRef } from 'react';
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
import AsciiColorTransitionSection from './_components/sidebar/AsciiColorTransitionSection';
import AsciiOpacitySection from './_components/sidebar/AsciiOpacitySection';
import useManualCharColor from './_hooks/useManualCharColor';
import useAsciiRecord from './_hooks/useAsciiRecord';
import useAsciiFileRevokeObjectURL from './_hooks/useAsciiFileRevokeObjectURL';
import useAsciiColorTransition from './_hooks/useAsciiColorTransition';
import { MediaType, AsciiColor } from 'ascii-react';

const video1 = 'https://assets.codepen.io/907471/mouse.mp4';

const Page = () => {
  const [src, setSrc] = useState(video1);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [imagesQueue, setImagesQueue] = useState<
    {
      file: File;
      url: string;
      name: string;
    }[]
  >([]);

  const [mediaType, setMediaType] = useState<MediaType>('video');
  const [resolution, setResolution] = useState(96);
  const [fontSize, setFontSize] = useState(8);
  const [charInterval, setCharInterval] = useState(100);
  const [color, setColor] = useState<AsciiColor>('auto');
  const [charsRandomLevel, setCharsRandomLevel] =
    useState<CharsRandomLevel>('none');
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<HexColor>('#ffffff');
  const [recordTime, setRecordTime] = useState(5); // seconds
  const [recordFormat, setRecordFormat] = useState<'webm' | 'mp4' | 'images'>(
    'webm',
  );
  const [quality, setQuality] = useState(10_000_000); // bps, default 10Mbps
  const [videoFps, setVideoFps] = useState(30); // frames per second for images export
  const [ignoreBright, setIgnoreBright] = useState(0); // 0~1
  const [invert, setInvert] = useState(false);
  const [opacity, setOpacity] = useState(0.5);
  const [manualCharColors, setManualCharColors] = useState<ManualCharColor[]>([
    { char: '', color: '#000000' },
  ]);
  const [startColor, setStartColor] = useState('#000000');
  const [endColor, setEndColor] = useState('#ffffff');
  const [gradientDuration, setGradientDuration] = useState(5);

  useAsciiFileRevokeObjectURL({ fileUrl });
  const { handleRecord, handleBatchExport, isBatching, batchProgress } =
    useAsciiRecord({
      setIsRecording,
      recorderRef,
      recordTime,
      recordFormat,
      quality,
      mediaType,
    });

  const {
    handleCharChange,
    handleColorChange,
    handleHexInputChange,
    handleAddCharColor,
    handleRemoveCharColor,
  } = useManualCharColor({ setManualCharColors });

  const { startGradient } = useAsciiColorTransition({
    startColor,
    endColor,
    duration: gradientDuration,
    onUpdate: (c) => setColor(c as HexColor),
  });

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
            opacity={opacity}
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
            mediaType={mediaType}
            fileUrl={fileUrl}
            setFileUrl={setFileUrl}
            setSrc={setSrc}
            imagesQueue={imagesQueue}
            setImagesQueue={setImagesQueue}
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
          <AsciiOpacitySection opacity={opacity} setOpacity={setOpacity} />
          <Separator className="my-4" />
          <AsciiColorTransitionSection
            startColor={startColor}
            setStartColor={setStartColor}
            endColor={endColor}
            setEndColor={setEndColor}
            duration={gradientDuration}
            setDuration={setGradientDuration}
            onStart={startGradient}
          />
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
            mediaType={mediaType}
            videoFps={videoFps}
            setVideoFps={setVideoFps}
          />
          <Separator className="my-4" />
          <AsciiRecordButtonSection
            isRecording={isRecording}
            handleRecord={() => {
              if (mediaType === 'image' && imagesQueue.length > 0) {
                const shouldZip = imagesQueue.length > 1;
                handleBatchExport(
                  imagesQueue.map((i) => ({ url: i.url, name: i.name })),
                  { zip: shouldZip },
                  { setSrc, waitMs: 400 },
                );
              } else if (mediaType === 'video' && recordFormat === 'images') {
                const prevMediaType = mediaType;
                const prevSrc = src;
                handleBatchExport(
                  [{ url: src, name: 'video' }],
                  { zip: true, videoIntervalSec: 1 / Math.max(videoFps, 0.1) },
                  {
                    setSrc,
                    setMediaType,
                    waitMs: 300,
                    restore: () => {
                      setMediaType(prevMediaType);
                      setSrc(prevSrc);
                    },
                  },
                );
              } else {
                handleRecord();
              }
            }}
            mediaType={mediaType}
            imagesCount={imagesQueue.length}
          />
        </div>
      </aside>

      {isBatching ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50">
          <div className="rounded-md bg-white p-6 shadow-lg">
            <div className="mb-2 text-lg font-semibold">변환 중...</div>
            <div className="text-sm text-gray-600">
              {batchProgress.current} / {batchProgress.total}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Page;
