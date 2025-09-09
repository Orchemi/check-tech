import React, { useCallback, useState } from 'react';
import { MediaType } from 'ascii-react';
import JSZip from 'jszip';

interface UseAsciiRecordArgs {
  setIsRecording: (v: boolean) => void;
  recorderRef: React.RefObject<MediaRecorder | null>;
  recordTime: number;
  recordFormat: 'webm' | 'mp4' | 'images';
  quality: number;
  mediaType: MediaType;
  getVideoRef?: () => HTMLVideoElement | null;
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
    if (mediaType === 'video' && recordFormat === 'images') {
      // Guard: this path should be handled by handleBatchExport in page layer
      alert(
        '이미지 프레임 추출 모드를 선택했습니다. 버튼을 다시 눌러 진행하세요.',
      );
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
      options?: {
        zip?: boolean;
        videoIntervalSec?: number;
        framesToVideo?: boolean;
        outputMime?: string;
      },
      controls?: {
        setSrc?: (url: string) => void;
        setMediaType?: (t: MediaType) => void;
        restore?: () => void;
        waitMs?: number;
      },
    ) => {
      if (!items || items.length === 0) return;
      if (mediaType !== 'image' && mediaType !== 'video') return;

      setIsBatching(true);
      setBatchProgress({ current: 0, total: items.length });

      const zip = options?.zip ? new JSZip() : null;
      const downloads: { blob: Blob; name: string }[] = [];

      if (mediaType === 'image') {
        for (let i = 0; i < items.length; i += 1) {
          const item = items[i];
          if (controls?.setSrc) controls.setSrc(item.url);
          const waitMs = controls?.waitMs ?? 300;
          await new Promise((resolve) => setTimeout(resolve, waitMs));
          const blob = await exportImageOnce();
          if (blob) {
            const filename = item.name.replace(/\.[^.]+$/, '') + '.png';
            if (zip) zip.file(filename, blob);
            else downloads.push({ blob, name: filename });
          }
          setBatchProgress({ current: i + 1, total: items.length });
        }
      } else if (mediaType === 'video') {
        // items should have length 1 for video export: the video URL
        const videoUrl = items[0]?.url;
        if (!videoUrl) {
          setIsBatching(false);
          return;
        }
        const intervalSec = options?.videoIntervalSec ?? 0.5;
        const buildVideo = options?.framesToVideo === true;
        const fps = intervalSec > 0 ? Math.round(1 / intervalSec) : 30;
        // Create a hidden video to iterate frames
        const video = document.createElement('video');
        video.src = videoUrl;
        video.crossOrigin = 'anonymous';
        video.muted = true;
        await new Promise<void>((resolve, reject) => {
          video.onloadedmetadata = () => resolve();
          video.onerror = () => reject(new Error('비디오 로드 실패'));
        });

        const duration = video.duration || 0;
        const frames: number[] = [];
        for (let t = 0; t <= duration; t += intervalSec) frames.push(t);
        setBatchProgress({ current: 0, total: frames.length });

        // Offscreen canvas to snapshot raw video frame to an image URL
        const offscreen = document.createElement('canvas');
        const offctx = offscreen.getContext('2d');
        offscreen.width = video.videoWidth;
        offscreen.height = video.videoHeight;
        if (!offctx) {
          alert('캔버스 컨텍스트를 가져올 수 없습니다.');
          setIsBatching(false);
          return;
        }

        const waitMs = controls?.waitMs ?? 300;
        // Setup MediaRecorder on ASCII canvas stream if building a video
        let mediaRecorder: MediaRecorder | null = null;
        let recordedChunks: Blob[] = [];
        if (buildVideo) {
          const asciiCanvas = document.querySelector(
            'canvas',
          ) as HTMLCanvasElement | null;
          if (!asciiCanvas) {
            alert('캔버스를 찾을 수 없습니다.');
            setIsBatching(false);
            return;
          }
          const stream = asciiCanvas.captureStream(fps);
          let mime = options?.outputMime ?? 'video/webm;codecs=vp9';
          if (!MediaRecorder.isTypeSupported(mime)) mime = 'video/webm';
          mediaRecorder = new MediaRecorder(stream, { mimeType: mime });
          mediaRecorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) recordedChunks.push(e.data);
          };
          mediaRecorder.start();
        }
        for (let i = 0; i < frames.length; i += 1) {
          const t = frames[i];
          video.currentTime = Math.min(t, duration);
          await new Promise((r) => {
            const onSeeked = () => {
              video.removeEventListener('seeked', onSeeked);
              r(null);
            };
            video.addEventListener('seeked', onSeeked);
          });

          offctx.drawImage(video, 0, 0, offscreen.width, offscreen.height);

          // Convert frame to image URL and let AsciiMedia render it as image
          if (controls?.setMediaType) controls.setMediaType('image');
          if (controls?.setSrc)
            controls.setSrc(offscreen.toDataURL('image/png'));
          await new Promise((r) => setTimeout(r, waitMs));

          // Capture the ASCII-rendered canvas
          if (!buildVideo) {
            const blob = await exportImageOnce();
            if (blob) {
              const filename = `frame_${String(i + 1).padStart(4, '0')}.png`;
              if (zip) zip.file(filename, blob);
              else downloads.push({ blob, name: filename });
            }
          }
          setBatchProgress({ current: i + 1, total: frames.length });
        }

        if (buildVideo && mediaRecorder) {
          await new Promise<void>((resolve) => {
            mediaRecorder!.onstop = () => resolve();
            mediaRecorder!.stop();
          });
          const outBlob = new Blob(recordedChunks, {
            type: recordedChunks[0]?.type || 'video/webm',
          });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(outBlob);
          a.download = 'ascii-video.webm';
          a.click();
          setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        }

        // restore media type/src if provided
        if (controls?.restore) controls.restore();
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
