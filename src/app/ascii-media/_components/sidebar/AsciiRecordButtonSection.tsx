import { Button } from '@/components/ui';
import { MediaType } from 'ascii-react';

interface AsciiRecordButtonSectionProps {
  isRecording: boolean;
  handleRecord: () => void;
  mediaType: MediaType;
  imagesCount?: number;
}

const AsciiRecordButtonSection = ({
  isRecording,
  handleRecord,
  mediaType,
  imagesCount = 0,
}: AsciiRecordButtonSectionProps) => {
  return (
    <Button
      className="w-full"
      onClick={handleRecord}
      disabled={mediaType === 'video' ? isRecording : false}
    >
      {mediaType === 'image'
        ? imagesCount > 1
          ? '이미지 일괄 저장'
          : '이미지 저장'
        : isRecording
          ? '녹화 중...'
          : '녹화 시작'}
    </Button>
  );
};

export default AsciiRecordButtonSection;
