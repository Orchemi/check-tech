import React, { useCallback, useState } from 'react';
import { MediaType } from 'ascii-react';
import JSZip from 'jszip';

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
  const [isBatching, setIsBatching] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });

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

  const exportImageOnce = useCallback(async () => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement | null;
    if (!canvas) {
      alert('캔버스를 찾을 수 없습니다.');
      return null;
    }
    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  }, []);

  const handleBatchExport = useCallback(
    async (
      items: Array<{ url: string; name: string }>,
      options?: { zip?: boolean },
      controls?: { setSrc?: (url: string) => void; waitMs?: number },
    ) => {
      if (!items || items.length === 0) return;
      if (mediaType !== 'image') return;

      setIsBatching(true);
      setBatchProgress({ current: 0, total: items.length });

      const zip = options?.zip ? new JSZip() : null;
      const downloads: { blob: Blob; name: string }[] = [];

      for (let i = 0; i < items.length; i += 1) {
        const item = items[i];
        if (controls?.setSrc) {
          controls.setSrc(item.url);
        }
        const waitMs = controls?.waitMs ?? 300;
        await new Promise((resolve) => setTimeout(resolve, waitMs));

        const blob = await exportImageOnce();
        if (blob) {
          const filename = item.name.replace(/\.[^.]+$/, '') + '.png';
          if (zip) {
            zip.file(filename, blob);
          } else {
            downloads.push({ blob, name: filename });
          }
        }
        setBatchProgress({ current: i + 1, total: items.length });
      }

      if (zip) {
        const content = await zip.generateAsync({ type: 'blob' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(content);
        a.download = 'ascii-images.zip';
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      } else {
        downloads.forEach(({ blob, name }) => {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = name;
          a.click();
          setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        });
      }

      setIsBatching(false);
    },
    [exportImageOnce, mediaType],
  );

  return { handleRecord, handleBatchExport, isBatching, batchProgress };
};

export default useAsciiRecord;
