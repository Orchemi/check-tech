import { Label } from '@/components/ui';
import { Slider } from '@/components/ui/slider';

interface AsciiOpacitySectionProps {
  opacity: number;
  setOpacity: (v: number) => void;
}

const AsciiOpacitySection = ({
  opacity,
  setOpacity,
}: AsciiOpacitySectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="opacity-slider" className="mb-3 block">
        불투명도: {(opacity * 100).toFixed(0)}%
      </Label>
      <Slider
        min={0}
        max={100}
        step={1}
        value={[opacity * 100]}
        onValueChange={([v]) => setOpacity(v / 100)}
        className="w-full"
      />
    </div>
  );
};

export default AsciiOpacitySection;
