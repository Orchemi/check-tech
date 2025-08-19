import { Label } from '@/components/ui';
import { Slider } from '@/components/ui/slider';

interface AsciiResolutionSectionProps {
  resolution: number;
  setResolution: (v: number) => void;
  fontSize: number;
  setFontSize: (v: number) => void;
  charInterval: number;
  setCharInterval: (v: number) => void;
}

const AsciiResolutionSection = ({
  resolution,
  setResolution,
  fontSize,
  setFontSize,
  charInterval,
  setCharInterval,
}: AsciiResolutionSectionProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="resolution-slider" className="mb-3 block">
          해상도: {resolution}px
        </Label>
        <Slider
          min={24}
          max={300}
          step={1}
          value={[resolution]}
          onValueChange={([v]) => setResolution(v)}
          className="w-full"
        />
      </div>
      <div>
        <Label htmlFor="font-size-slider" className="mb-3 block">
          폰트 크기: {fontSize}px
        </Label>
        <Slider
          min={4}
          max={24}
          step={1}
          value={[fontSize]}
          onValueChange={([v]) => setFontSize(v)}
          className="w-full"
        />
      </div>
      <div>
        <Label htmlFor="interval-slider" className="mb-3 block">
          간격: {charInterval}ms
        </Label>
        <Slider
          min={16}
          max={500}
          step={1}
          value={[charInterval]}
          onValueChange={([v]) => setCharInterval(v)}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default AsciiResolutionSection;
