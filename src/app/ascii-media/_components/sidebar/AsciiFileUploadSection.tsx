import { Label } from '@/components/ui';
import DndFileInput from '../DndFileInput';

interface AsciiFileUploadSectionProps {
  fileUrl: string;
  setFileUrl: (v: string) => void;
  setSrc: (v: string) => void;
}

const AsciiFileUploadSection = ({
  fileUrl,
  setFileUrl,
  setSrc,
}: AsciiFileUploadSectionProps) => {
  return (
    <div className="space-y-2">
      <Label>파일 업로드</Label>
      <DndFileInput
        onFile={(file) => {
          if (fileUrl) URL.revokeObjectURL(fileUrl);
          const url = URL.createObjectURL(file);
          setFileUrl(url);
          setSrc(url);
        }}
        accept="image/*,video/*"
      />
    </div>
  );
};

export default AsciiFileUploadSection;
