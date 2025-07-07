'use client';

import { AsciiMedia } from 'ascii-react';
import { useState, useRef } from 'react';
import {
  Input,
  Button,
  Slider,
  Label,
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
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
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

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
    }, RECORD_TIME); // 5초간 녹화
  };

  const RECORD_TIME = 5000;

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
              <Slider
                id="resolution-slider"
                min={24}
                max={192}
                value={[resolution]}
                onValueChange={([v]) => setResolution(v)}
              />
            </div>
            <div>
              <Label htmlFor="font-size-slider" className="mb-2 block">
                폰트 크기: {fontSize}px
              </Label>
              <Slider
                id="font-size-slider"
                min={4}
                max={24}
                value={[fontSize]}
                onValueChange={([v]) => setFontSize(v)}
              />
            </div>
            <div>
              <Label htmlFor="interval-slider" className="mb-2 block">
                간격: {charInterval}ms
              </Label>
              <Slider
                id="interval-slider"
                min={16}
                max={500}
                value={[charInterval]}
                onValueChange={([v]) => setCharInterval(v)}
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
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="h-10 w-10 border-none p-0"
              />
              <Input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-24"
                maxLength={7}
              />
            </div>
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
