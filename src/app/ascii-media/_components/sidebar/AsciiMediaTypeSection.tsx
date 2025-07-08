import { Label, Tabs, TabsList, TabsTrigger } from '@/components/ui';
import { MediaType } from 'ascii-react';

interface AsciiMediaTypeSectionProps {
  mediaType: MediaType;
  setMediaType: (v: MediaType) => void;
}

const AsciiMediaTypeSection = ({
  mediaType,
  setMediaType,
}: AsciiMediaTypeSectionProps) => {
  return (
    <div className="space-y-2">
      <Label>타입</Label>
      <Tabs
        value={mediaType}
        onValueChange={(v) => setMediaType(v as MediaType)}
        className="w-full"
      >
        <TabsList className="flex w-full justify-between">
          <TabsTrigger value="video" className="flex-1">
            비디오
          </TabsTrigger>
          <TabsTrigger value="image" className="flex-1">
            이미지
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default AsciiMediaTypeSection;
