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
import useManualCharColor from './_hooks/useManualCharColor';
import useAsciiRecord from './_hooks/useAsciiRecord';
import useAsciiFileRevokeObjectURL from './_hooks/useAsciiFileRevokeObjectURL';
import { MediaType, AsciiColor } from 'ascii-react';

const video1 = 'https://assets.codepen.io/907471/mouse.mp4';

const Page = () => {
  const [src, setSrc] = useState(video1);
  const [fileUrl, setFileUrl] = useState<string>('');

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
  const [recordFormat, setRecordFormat] = useState<'webm' | 'mp4'>('webm');
  const [quality, setQuality] = useState(10_000_000); // bps, default 10Mbps
  const [ignoreBright, setIgnoreBright] = useState(0); // 0~1
  const [invert, setInvert] = useState(false);
  const [manualCharColors, setManualCharColors] = useState<ManualCharColor[]>([
    { char: '', color: '#000000' },
  ]);

  useAsciiFileRevokeObjectURL({ fileUrl });
  const { handleRecord } = useAsciiRecord({
    fileUrl,
    setIsRecording,
    recorderRef,
    recordTime,
    recordFormat,
    quality,
  });

  const {
    handleCharChange,
    handleColorChange,
    handleHexInputChange,
    handleAddCharColor,
    handleRemoveCharColor,
  } = useManualCharColor({ setManualCharColors });

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
