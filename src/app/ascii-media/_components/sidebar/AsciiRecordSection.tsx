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

interface AsciiRecordSectionProps {
  recordTime: number;
  setRecordTime: (v: number) => void;
  recordFormat: 'webm' | 'mp4';
  setRecordFormat: (v: 'webm' | 'mp4') => void;
  quality: number;
  setQuality: (v: number) => void;
}

const AsciiRecordSection = ({
  recordTime,
  setRecordTime,
  recordFormat,
  setRecordFormat,
  quality,
  setQuality,
}: AsciiRecordSectionProps) => {
  return (
    <>
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
    </>
  );
};

export default AsciiRecordSection;
