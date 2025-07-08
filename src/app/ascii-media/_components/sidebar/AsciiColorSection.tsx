import { Button, Input, Label } from '@/components/ui';
import { AsciiColor, HexColor } from 'ascii-react';

interface AsciiColorSectionProps {
  color: AsciiColor;
  setColor: (v: AsciiColor) => void;
}

const AsciiColorSection = ({ color, setColor }: AsciiColorSectionProps) => {
  return (
    <div className="space-y-2">
      <Label>색상</Label>
      <div className="flex items-center gap-2">
        <Button
          variant={color === 'auto' ? 'default' : 'outline'}
          onClick={() => setColor('auto' as AsciiColor)}
        >
          Auto
        </Button>
        <Button
          variant={color === 'mono' ? 'default' : 'outline'}
          onClick={() => setColor('mono' as AsciiColor)}
        >
          Mono
        </Button>
        <Input
          type="color"
          value={color.startsWith('#') ? color : '#000000'}
          onChange={(e) => setColor(e.target.value as HexColor)}
          className="h-10 w-10 border-none p-0"
        />
        <Input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value as HexColor)}
          className="w-24"
        />
      </div>
    </div>
  );
};

export default AsciiColorSection;
