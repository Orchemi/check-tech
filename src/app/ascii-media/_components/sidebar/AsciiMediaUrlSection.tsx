import { Label, Input } from '@/components/ui';

interface AsciiMediaUrlSectionProps {
  src: string;
  setSrc: (v: string) => void;
}

const AsciiMediaUrlSection = ({ src, setSrc }: AsciiMediaUrlSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="media-url">미디어 URL</Label>
      <Input
        id="media-url"
        value={src}
        onChange={(e) => setSrc(e.target.value)}
        placeholder="이미지 또는 동영상 URL"
      />
    </div>
  );
};

export default AsciiMediaUrlSection;
