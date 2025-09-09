import { Button } from '@/components/ui';
import { MediaType } from 'ascii-react';

interface AsciiRecordButtonSectionProps {
  isRecording: boolean;
  handleRecord: () => void;
  mediaType: MediaType;
}

const AsciiRecordButtonSection = ({
  isRecording,
  handleRecord,
  mediaType,
}: AsciiRecordButtonSectionProps) => {
  return (
    <Button
      className="w-full"
      onClick={handleRecord}
      disabled={mediaType === 'video' ? isRecording : false}
    >
      {mediaType === 'image'
        ? '이미지 저장'
        : isRecording
          ? '녹화 중...'
          : '녹화 시작'}
    </Button>
  );
};

export default AsciiRecordButtonSection;
