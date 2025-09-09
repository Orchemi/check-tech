import {
  Label,
  Tabs,
  TabsList,
  TabsTrigger,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Separator,
} from '@/components/ui';
import { MediaType } from 'ascii-react';
import { Input } from '@/components/ui';
import { Slider } from '@/components/ui/slider';

interface AsciiRecordSectionProps {
  recordTime: number;
  setRecordTime: (v: number) => void;
  recordFormat: 'webm' | 'mp4' | 'images';
  setRecordFormat: (v: 'webm' | 'mp4' | 'images') => void;
  quality: number;
  setQuality: (v: number) => void;
  mediaType: MediaType;
  videoFps?: number;
  setVideoFps?: (v: number) => void;
  imagesOutput?: 'zip' | 'video';
  setImagesOutput?: (v: 'zip' | 'video') => void;
}

const AsciiRecordSection = ({
  recordTime,
  setRecordTime,
  recordFormat,
  setRecordFormat,
  quality,
  setQuality,
  mediaType,
  videoFps,
  setVideoFps,
  imagesOutput,
  setImagesOutput,
}: AsciiRecordSectionProps) => {
  if (mediaType === 'image') {
    return (
      <>
        <div className="space-y-2">
          <Label>이미지 저장</Label>
          <div className="text-sm text-gray-500">
            현재 캔버스를 PNG로 저장합니다.
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="record-time-slider" className="mb-3 block">
          녹화 시간: {recordTime}초
        </Label>
        <Slider
          min={1}
          max={10}
          step={1}
          value={[recordTime]}
          onValueChange={([v]: number[]) => setRecordTime(v)}
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
          onValueChange={(v) => setRecordFormat(v as 'webm' | 'mp4' | 'images')}
          className="w-full"
        >
          <TabsList className="flex w-full justify-between">
            <TabsTrigger value="webm" className="flex-1">
              webm
            </TabsTrigger>
            <TabsTrigger value="mp4" className="flex-1">
              mp4
            </TabsTrigger>
            <TabsTrigger value="images" className="flex-1">
              images
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {recordFormat === 'images' ? (
        <>
          <Separator className="my-4" />
          <div className="space-y-2">
            <Label>이미지 출력</Label>
            <Tabs
              value={imagesOutput}
              onValueChange={(v) =>
                setImagesOutput && setImagesOutput(v as 'zip' | 'video')
              }
              className="w-full"
            >
              <TabsList className="flex w-full justify-between">
                <TabsTrigger value="zip" className="flex-1">
                  zip
                </TabsTrigger>
                <TabsTrigger value="video" className="flex-1">
                  video
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Separator className="my-4" />
          <div className="space-y-2">
            <Label htmlFor="fps-input" className="mb-3 block">
              초당 프레임(FPS)
            </Label>
            <Input
              id="fps-input"
              type="number"
              min={0.1}
              step={0.1}
              value={videoFps ?? 2}
              onChange={(e) =>
                setVideoFps && setVideoFps(Number(e.target.value))
              }
            />
          </div>
        </>
      ) : (
        <>
          <Separator className="my-4" />
          <div className="space-y-2">
            <Label htmlFor="record-time-slider" className="mb-3 block">
              녹화 시간: {recordTime}초
            </Label>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[recordTime]}
              onValueChange={([v]: number[]) => setRecordTime(v)}
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
        </>
      )}
    </>
  );
};

export default AsciiRecordSection;
