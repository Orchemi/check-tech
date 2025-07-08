import { Label, Tabs, TabsList, TabsTrigger } from '@/components/ui';

interface AsciiInvertSectionProps {
  invert: boolean;
  setInvert: (v: boolean) => void;
}

const AsciiInvertSection = ({ invert, setInvert }: AsciiInvertSectionProps) => {
  return (
    <div className="space-y-2">
      <Label>명암 반전</Label>
      <Tabs
        value={invert ? 'invert' : 'original'}
        onValueChange={(v) => setInvert(v === 'invert')}
        className="w-full"
      >
        <TabsList className="flex w-full justify-between">
          <TabsTrigger value="original" className="flex-1">
            원본
          </TabsTrigger>
          <TabsTrigger value="invert" className="flex-1">
            반전
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default AsciiInvertSection;
