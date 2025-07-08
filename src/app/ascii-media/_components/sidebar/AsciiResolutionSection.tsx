import { Label } from '@/components/ui';

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
  );
};

export default AsciiResolutionSection;
