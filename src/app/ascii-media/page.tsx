'use client';

import { AsciiMedia } from 'ascii-react';
import { useState, useRef } from 'react';
import {
  Input,
  Button,
  Label,
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui';

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
  const [backgroundColor, setBackgroundColor] =
    useState<`#${string}`>('#ffffff');
  const [recordTime, setRecordTime] = useState(5); // seconds
  const [recordFormat, setRecordFormat] = useState<'webm' | 'mp4'>('webm');
  const [quality, setQuality] = useState(10_000_000); // bps, default 10Mbps
  const [ignoreBright, setIgnoreBright] = useState(0); // 0~1

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
    let videoBitsPerSecond = quality;
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
          />
        </div>
        <canvas style={{ display: 'none' }} />
      </div>

      {/* 오른쪽 사이드바 (설정 패널) 항상 표시 */}
      <div className="w-[360px]" />

      <aside className="fixed top-0 right-0 z-20 flex h-full w-[360px] flex-col border-l bg-white shadow-lg">
        <div className="border-b px-6 py-6 text-lg font-bold">
          Ascii Media 설정
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="media-url">미디어 URL</Label>
            <Input
              id="media-url"
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              placeholder="이미지 또는 동영상 URL"
            />
          </div>
          <Separator className="my-4" />

          <div className="space-y-2">
            <Label>타입</Label>
            <Tabs
              value={mediaType}
              onValueChange={(v) => setMediaType(v as typeof mediaType)}
              className="w-full"
            >
              <TabsList className="flex w-full justify-between">
                <TabsTrigger value="video" className="flex-1">
                  Video
                </TabsTrigger>
                <TabsTrigger value="image" className="flex-1">
                  Image
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Separator className="my-4" />

          <div className="space-y-4">
            <div>
              <Label htmlFor="resolution-slider" className="mb-2 block">
                해상도: {resolution}px
              </Label>
              <input
                id="resolution-slider"
                type="range"
                min={24}
                max={192}
                value={resolution}
                onChange={(e) => setResolution(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="font-size-slider" className="mb-2 block">
                폰트 크기: {fontSize}px
              </Label>
              <input
                id="font-size-slider"
                type="range"
                min={4}
                max={24}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="interval-slider" className="mb-2 block">
                간격: {charInterval}ms
              </Label>
              <input
                id="interval-slider"
                type="range"
                min={16}
                max={500}
                value={charInterval}
                onChange={(e) => setCharInterval(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          <Separator className="my-4" />

          <div className="space-y-2">
            <Label>색상</Label>
            <div className="flex items-center gap-2">
              <Button
                variant={color === 'auto' ? 'default' : 'outline'}
                onClick={() => setColor('auto')}
              >
                Auto
              </Button>
              <Button
                variant={color === 'mono' ? 'default' : 'outline'}
                onClick={() => setColor('mono')}
              >
                Mono
              </Button>
              <Input
                type="color"
                value={color.startsWith('#') ? color : '#000000'}
                onChange={(e) => setColor(e.target.value as `#${string}`)}
                className="h-10 w-10 border-none p-0"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value as `#${string}`)}
                className="w-24"
              />
            </div>
          </div>
          <Separator className="my-4" />

          <div className="space-y-2">
            <Label>문자 랜덤 레벨</Label>
            <Tabs
              value={charsRandomLevel}
              onValueChange={(v) =>
                setCharsRandomLevel(v as typeof charsRandomLevel)
              }
              className="w-full"
            >
              <TabsList className="flex w-full justify-between">
                <TabsTrigger value="none" className="flex-1">
                  none
                </TabsTrigger>
                <TabsTrigger value="group" className="flex-1">
                  group
                </TabsTrigger>
                <TabsTrigger value="all" className="flex-1">
                  all
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Separator className="my-4" />

          <div className="space-y-2">
            <Label htmlFor="background-color-picker">배경색</Label>
            <div className="flex items-center gap-2">
              <Input
                id="background-color-picker"
                type="color"
                value={backgroundColor}
                onChange={(e) =>
                  setBackgroundColor(e.target.value as `#${string}`)
                }
                className="h-10 w-10 border-none p-0"
              />
              <Input
                type="text"
                value={backgroundColor}
                onChange={(e) =>
                  setBackgroundColor(e.target.value as `#${string}`)
                }
                className="w-24"
                maxLength={7}
              />
            </div>
          </div>
          <Separator className="my-4" />

          <div className="space-y-2">
            <Label htmlFor="ignore-bright-slider" className="mb-2 block">
              영역 무시: {(ignoreBright * 100).toFixed(0)}%
            </Label>
            <input
              id="ignore-bright-slider"
              type="range"
              min={0}
              max={100}
              step={1}
              value={ignoreBright * 100}
              onChange={(e) => setIgnoreBright(Number(e.target.value) / 100)}
              className="w-full"
            />
          </div>
          <Separator className="my-4" />

          <div className="space-y-2">
            <Label htmlFor="record-time-slider" className="mb-2 block">
              녹화 시간: {recordTime}초
            </Label>
            <input
              id="record-time-slider"
              type="range"
              min={1}
              max={10}
              step={1}
              value={recordTime}
              onChange={(e) => setRecordTime(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <Separator className="my-4" />

          <div className="space-y-2">
            <Label htmlFor="quality-select">화질</Label>
            <Select
              value={quality.toString()}
              onValueChange={(v) => setQuality(Number(v))}
            >
              <SelectTrigger id="quality-select" className="w-full">
                <SelectValue placeholder="화질 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2000000">2 Mbps (초저화질)</SelectItem>
                <SelectItem value="5000000">5 Mbps (저화질)</SelectItem>
                <SelectItem value="10000000">10 Mbps (기본)</SelectItem>
                <SelectItem value="30000000">30 Mbps (고화질)</SelectItem>
                <SelectItem value="50000000">50 Mbps (초고화질)</SelectItem>
                <SelectItem value="100000000">100 Mbps (최대)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator className="my-4" />

          <div className="space-y-2">
            <Label>녹화 포맷</Label>
            <Tabs
              value={recordFormat}
              onValueChange={(v) => setRecordFormat(v as 'webm' | 'mp4')}
              className="w-full"
            >
              <TabsList className="flex w-full justify-between">
                <TabsTrigger value="webm" className="flex-1">
                  webm
                </TabsTrigger>
                <TabsTrigger value="mp4" className="flex-1">
                  mp4
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Separator className="my-4" />

          <Button
            className="w-full"
            onClick={handleRecord}
            disabled={isRecording}
          >
            {isRecording ? '녹화 중...' : '녹화 시작'}
          </Button>
        </div>
      </aside>
    </div>
  );
};

export default Page;
