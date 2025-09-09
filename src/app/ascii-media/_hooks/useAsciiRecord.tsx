import React from 'react';
import { MediaType } from 'ascii-react';

interface UseAsciiRecordArgs {
  setIsRecording: (v: boolean) => void;
  recorderRef: React.RefObject<MediaRecorder | null>;
  recordTime: number;
  recordFormat: 'webm' | 'mp4';
  quality: number;
  mediaType: MediaType;
}
const useAsciiRecord = ({
  setIsRecording,
  recorderRef,
  recordTime,
  recordFormat,
  quality,
  mediaType,
}: UseAsciiRecordArgs) => {
  const handleRecord = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      alert('캔버스를 찾을 수 없습니다.');
      return;
    }
    if (mediaType === 'image') {
      const canvasEl = canvas as HTMLCanvasElement;
      canvasEl.toBlob((blob) => {
        if (!blob) {
          alert('이미지 생성에 실패했습니다.');
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ascii-canvas.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, 'image/png');
      return;
    }
    const stream = (canvas as HTMLCanvasElement).captureStream(30);
    let mimeType = 'video/webm;codecs=vp9';
    let fileExt = 'webm';
    if (recordFormat === 'mp4') {
      mimeType = 'video/mp4';
      fileExt = 'mp4';
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      alert(
        `${recordFormat.toUpperCase()} 포맷은 이 브라우저에서 지원되지 않습니다.`,
      );
      return;
    }
    const videoBitsPerSecond = quality;
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond,
    });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ascii-canvas.${fileExt}`;
      a.click();
      setIsRecording(false);
    };

    recorder.start();
    setIsRecording(true);
    recorderRef.current = recorder;

    setTimeout(() => {
      recorder.stop();
    }, recordTime * 1000); // 사용자가 지정한 초만큼 녹화
  };

  return { handleRecord };
};

export default useAsciiRecord;
