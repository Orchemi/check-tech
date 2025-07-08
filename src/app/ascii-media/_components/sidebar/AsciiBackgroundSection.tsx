import { Label, Input } from '@/components/ui';
import { HexColor } from 'ascii-react';

interface AsciiBackgroundSectionProps {
  backgroundColor: HexColor;
  setBackgroundColor: (v: HexColor) => void;
}

const AsciiBackgroundSection = ({
  backgroundColor,
  setBackgroundColor,
}: AsciiBackgroundSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="background-color-picker">배경색</Label>
      <div className="flex items-center gap-2">
        <Input
          id="background-color-picker"
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value as HexColor)}
          className="h-10 w-10 border-none p-0"
        />
        <Input
          type="text"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value as HexColor)}
          className="w-24"
          maxLength={7}
        />
      </div>
    </div>
  );
};

export default AsciiBackgroundSection;
