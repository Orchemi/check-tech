import { Label } from '@/components/ui';

interface AsciiIgnoreBrightSectionProps {
  ignoreBright: number;
  setIgnoreBright: (v: number) => void;
}

const AsciiIgnoreBrightSection = ({
  ignoreBright,
  setIgnoreBright,
}: AsciiIgnoreBrightSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="ignore-bright-slider" className="mb-2 block">
        밝은 부분 무시: {(ignoreBright * 100).toFixed(0)}%
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
  );
};

export default AsciiIgnoreBrightSection;
