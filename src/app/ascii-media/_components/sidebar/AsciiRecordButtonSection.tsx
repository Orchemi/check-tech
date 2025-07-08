import { Button } from '@/components/ui';

interface AsciiRecordButtonSectionProps {
  isRecording: boolean;
  handleRecord: () => void;
}

const AsciiRecordButtonSection = ({
  isRecording,
  handleRecord,
}: AsciiRecordButtonSectionProps) => {
  return (
    <Button className="w-full" onClick={handleRecord} disabled={isRecording}>
      {isRecording ? '녹화 중...' : '녹화 시작'}
    </Button>
  );
};

export default AsciiRecordButtonSection;
