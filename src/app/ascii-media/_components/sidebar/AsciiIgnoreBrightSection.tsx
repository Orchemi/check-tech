import { Label } from '@/components/ui';
import { Slider } from '@/components/ui/slider';

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
      <Label htmlFor="ignore-bright-slider" className="mb-3 block">
        영역 무시: {(ignoreBright * 100).toFixed(0)}%
      </Label>
      <Slider
        min={0}
        max={100}
        step={1}
        value={[ignoreBright * 100]}
        onValueChange={([v]) => setIgnoreBright(v / 100)}
        className="w-full"
      />
    </div>
  );
};

export default AsciiIgnoreBrightSection;
