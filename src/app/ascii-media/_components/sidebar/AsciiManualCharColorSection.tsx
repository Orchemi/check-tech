import { Input, Button, Label } from '@/components/ui';
import { PlusCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ManualCharColor } from 'ascii-react';

interface AsciiManualCharColorSectionProps {
  manualCharColors: ManualCharColor[];
  setManualCharColors: (v: ManualCharColor[]) => void;
  handleCharChange: (idx: number, value: string) => void;
  handleColorChange: (idx: number, value: string) => void;
  handleHexInputChange: (idx: number, value: string) => void;
  handleAddCharColor: () => void;
  handleRemoveCharColor: (idx: number) => void;
}

const AsciiManualCharColorSection = ({
  manualCharColors,
  handleCharChange,
  handleColorChange,
  handleHexInputChange,
  handleAddCharColor,
  handleRemoveCharColor,
}: AsciiManualCharColorSectionProps) => {
  return (
    <div className="space-y-2">
      <Label>문자 색상 강제</Label>
      {manualCharColors.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <Input
            type="text"
            maxLength={1}
            value={item.char}
            onChange={(e) => handleCharChange(idx, e.target.value)}
            className="w-10 shrink-0 placeholder:text-gray-300"
            placeholder="#"
          />
          <input
            type="color"
            value={item.color}
            onChange={(e) => handleColorChange(idx, e.target.value)}
            className="h-10 w-10 shrink-0 border-black p-0"
          />
          <Input
            type="text"
            value={item.color}
            onChange={(e) => handleHexInputChange(idx, e.target.value)}
            className={cn('w-full')}
            maxLength={7}
            pattern="^#[0-9a-fA-F]{8}$"
            placeholder="#000000"
          />
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-8 w-8 rounded-full', {
                hidden: manualCharColors.length === 1,
              })}
              onClick={() => handleRemoveCharColor(idx)}
              aria-label="문자 색상 세트 삭제"
            >
              <Trash2 className="h-4 w-4 text-red-700" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-8 w-8 rounded-full', {})}
              onClick={handleAddCharColor}
              aria-label="문자 색상 세트 추가"
            >
              <PlusCircle className="h-4 w-4 text-blue-700" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AsciiManualCharColorSection;
