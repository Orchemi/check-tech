import { Label, Tabs, TabsList, TabsTrigger } from '@/components/ui';
import { CharsRandomLevel } from 'ascii-react';

interface AsciiCharsRandomLevelSectionProps {
  charsRandomLevel: CharsRandomLevel;
  setCharsRandomLevel: (v: CharsRandomLevel) => void;
}

const AsciiCharsRandomLevelSection = ({
  charsRandomLevel,
  setCharsRandomLevel,
}: AsciiCharsRandomLevelSectionProps) => {
  return (
    <div className="space-y-2">
      <Label>문자 랜덤 레벨</Label>
      <Tabs
        value={charsRandomLevel}
        onValueChange={(v) => setCharsRandomLevel(v as CharsRandomLevel)}
        className="w-full"
      >
        <TabsList className="flex w-full justify-between">
          <TabsTrigger value="none" className="flex-1">
            없음
          </TabsTrigger>
          <TabsTrigger value="group" className="flex-1">
            그룹
          </TabsTrigger>
          <TabsTrigger value="all" className="flex-1">
            전체
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default AsciiCharsRandomLevelSection;
