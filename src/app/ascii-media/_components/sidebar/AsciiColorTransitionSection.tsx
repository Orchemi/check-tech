import { Label, Input, Button } from '@/components/ui';
import { Slider } from '@/components/ui/slider';

interface AsciiColorTransitionSectionProps {
  startColor: string;
  setStartColor: (v: string) => void;
  endColor: string;
  setEndColor: (v: string) => void;
  duration: number;
  setDuration: (v: number) => void;
  onStart: () => void;
}

const AsciiColorTransitionSection = ({
  startColor,
  setStartColor,
  endColor,
  setEndColor,
  duration,
  setDuration,
  onStart,
}: AsciiColorTransitionSectionProps) => {
  return (
    <div className="space-y-4">
      <Label className="mb-1 block">전환 시작점 색상</Label>
      <div className="flex items-center gap-2">
        <Input
          type="color"
          value={startColor}
          onChange={(e) => setStartColor(e.target.value)}
          className="h-10 w-10 shrink-0 border-none p-0"
        />
        <Input
          type="text"
          value={startColor}
          onChange={(e) => setStartColor(e.target.value)}
          className="w-full"
        />
      </div>
      <Label className="mb-1 block">전환 종료점 색상</Label>
      <div className="flex items-center gap-2">
        <Input
          type="color"
          value={endColor}
          onChange={(e) => setEndColor(e.target.value)}
          className="h-10 w-10 shrink-0 border-none p-0"
        />
        <Input
          type="text"
          value={endColor}
          onChange={(e) => setEndColor(e.target.value)}
          className="w-full"
        />
      </div>
      <Label className="mb-3 block">전환 시간: {duration}초</Label>
      <Slider
        min={1}
        max={20}
        step={1}
        value={[duration]}
        onValueChange={([v]) => setDuration(v)}
        className="w-full"
      />
      <Button className="mt-2 w-full" onClick={onStart}>
        전환 시작
      </Button>
    </div>
  );
};

export default AsciiColorTransitionSection;
