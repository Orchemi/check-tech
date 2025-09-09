import { Button, Label } from '@/components/ui';
import DndFileInput from '../DndFileInput';
import { MediaType } from 'ascii-react';

interface QueuedImage {
  file: File;
  url: string;
  name: string;
}

interface AsciiFileUploadSectionProps {
  mediaType: MediaType;
  fileUrl: string;
  setFileUrl: (v: string) => void;
  setSrc: (v: string) => void;
  imagesQueue: QueuedImage[];
  setImagesQueue: (
    v: QueuedImage[] | ((prev: QueuedImage[]) => QueuedImage[]),
  ) => void;
}

const AsciiFileUploadSection = ({
  mediaType,
  fileUrl,
  setFileUrl,
  setSrc,
  imagesQueue,
  setImagesQueue,
}: AsciiFileUploadSectionProps) => {
  if (mediaType === 'image') {
    return (
      <div className="space-y-2">
        <Label>이미지 업로드 (여러 개 가능)</Label>
        <DndFileInput
          multiple
          onFile={(file) => {
            const url = URL.createObjectURL(file);
            setImagesQueue((prev) => [...prev, { file, url, name: file.name }]);
            setSrc(url);
          }}
          onFiles={(files) => {
            const queued = files.map((file) => ({
              file,
              url: URL.createObjectURL(file),
              name: file.name,
            }));
            setImagesQueue((prev) => [...prev, ...queued]);
            if (queued[0]) setSrc(queued[0].url);
          }}
          accept="image/*,video/*"
        />
        <div className="text-xs text-gray-500">
          대기열: {imagesQueue.length}개
        </div>
        {imagesQueue.length > 0 ? (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="h-7 px-2 text-xs"
              onClick={() => {
                imagesQueue.forEach((i) => URL.revokeObjectURL(i.url));
                setImagesQueue([]);
              }}
            >
              대기열 비우기
            </Button>
          </div>
        ) : null}
      </div>
    );
  }
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
