import React, { useCallback, useRef, useState } from 'react';
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
  const abortRef = useRef(false);
  const activeMediaRecorderRef = useRef<MediaRecorder | null>(null);

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
        transcodeToMp4?: boolean;
      },
      controls?: {
        setSrc?: (url: string) => void;
        setMediaType?: (t: MediaType) => void;
        restore?: () => void;
        waitMs?: number;
        setCharInterval?: (v: number) => void;
        originalCharInterval?: number;
      },
    ) => {
      if (!items || items.length === 0) return;
      if (mediaType !== 'image' && mediaType !== 'video') return;

      abortRef.current = false;
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
          if (abortRef.current) break;
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

        const waitMs = controls?.waitMs ?? Math.max(1000 / fps, 16);

        // Choose ASCII canvas reference
        const canvases = Array.from(
          document.querySelectorAll('canvas'),
        ) as HTMLCanvasElement[];
        const visible = canvases.filter(
          (c) =>
            c.width > 0 &&
            c.height > 0 &&
            getComputedStyle(c).display !== 'none',
        );
        const asciiCanvas =
          (visible.length > 0 ? visible : canvases).sort(
            (a, b) => b.width * b.height - a.width * a.height,
          )[0] || null;
        if (!asciiCanvas) {
          alert('캔버스를 찾을 수 없습니다.');
          setIsBatching(false);
          return;
        }

        // Paths:
        // A) If transcodeToMp4=true → collect PNG frames from ASCII canvas; assemble with ffmpeg for exact duration
        // B) Else → record live canvas stream with MediaRecorder (webm/mp4 if supported)
        const collectPngs = !!options?.transcodeToMp4;
        const framePngs: { blob: Blob; name: string }[] = [];

        let mediaRecorder: MediaRecorder | null = null;
        const recordedChunks: Blob[] = [];
        let recordCanvas: HTMLCanvasElement | null = null;
        let recordCtx: CanvasRenderingContext2D | null = null;
        if (buildVideo && !collectPngs) {
          recordCanvas = document.createElement('canvas');
          recordCanvas.width = asciiCanvas.width || video.videoWidth;
          recordCanvas.height = asciiCanvas.height || video.videoHeight;
          recordCtx = recordCanvas.getContext('2d');
          if (!recordCtx) {
            alert('캔버스 컨텍스트를 가져올 수 없습니다.');
            setIsBatching(false);
            return;
          }
          const stream = recordCanvas.captureStream(fps);
          const mimeCandidates = [
            'video/mp4;codecs=h264',
            'video/mp4',
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp8',
            'video/webm',
          ];
          let mime = options?.outputMime || '';
          if (!mime || !MediaRecorder.isTypeSupported(mime)) {
            mime =
              mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) ||
              'video/webm';
          }
          mediaRecorder = new MediaRecorder(stream, { mimeType: mime });
          mediaRecorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) recordedChunks.push(e.data);
          };
          const timeSliceMs = Math.max(1000 / fps, 100);
          mediaRecorder.start(timeSliceMs);
          activeMediaRecorderRef.current = mediaRecorder;
        }

        for (let i = 0; i < frames.length; i += 1) {
          if (abortRef.current) {
            break;
          }
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
          await new Promise((r) => requestAnimationFrame(() => r(null)));
          await new Promise((r) => requestAnimationFrame(() => r(null)));
          await new Promise((r) => setTimeout(r, Math.max(0, waitMs - 2)));

          if (!buildVideo) {
            const blob = await exportImageOnce();
            if (blob) {
              const filename = `frame_${String(i + 1).padStart(4, '0')}.png`;
              if (zip) zip.file(filename, blob);
              else downloads.push({ blob, name: filename });
            }
          } else if (collectPngs) {
            const png = await exportImageOnce();
            if (png)
              framePngs.push({
                blob: png,
                name: `frame_${String(i + 1).padStart(4, '0')}.png`,
              });
          } else if (recordCtx && recordCanvas) {
            recordCtx.clearRect(0, 0, recordCanvas.width, recordCanvas.height);
            recordCtx.drawImage(
              asciiCanvas,
              0,
              0,
              recordCanvas.width,
              recordCanvas.height,
            );
          }
          setBatchProgress({ current: i + 1, total: frames.length });
        }

        if (abortRef.current) {
          try {
            const mr = activeMediaRecorderRef.current;
            if (mr && mr.state !== 'inactive') mr.stop();
          } catch {}
          activeMediaRecorderRef.current = null;
          if (controls?.restore) controls.restore();
          setIsBatching(false);
          return;
        }

        if (buildVideo && mediaRecorder) {
          try {
            mediaRecorder.requestData();
          } catch {}
          await new Promise((r) => setTimeout(r, 150));
          await new Promise<void>((resolve) => {
            mediaRecorder!.onstop = () => resolve();
            mediaRecorder!.stop();
          });
          activeMediaRecorderRef.current = null;
          if (recordedChunks.length === 0) {
            alert(
              '녹화된 비디오 데이터가 비어 있습니다. FPS를 조정해 다시 시도해주세요.',
            );
          }
          const outBlob = new Blob(recordedChunks, {
            type: recordedChunks[0]?.type || 'video/webm',
          });
          const filename = outBlob.type.includes('mp4')
            ? 'ascii-video.mp4'
            : 'ascii-video.webm';

          const a = document.createElement('a');
          a.href = URL.createObjectURL(outBlob);
          a.download = filename;
          a.click();
          setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        } else if (buildVideo && collectPngs) {
          try {
            const { FFmpeg } = await import('@ffmpeg/ffmpeg');
            const { fetchFile, toBlobURL } = await import('@ffmpeg/util');
            const ffmpeg = new FFmpeg();
            const loadWithFallback = async () => {
              const bases = [
                'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd',
                'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd',
              ];
              let lastErr: unknown = null;
              for (const baseURL of bases) {
                try {
                  await ffmpeg.load({
                    coreURL: await toBlobURL(
                      `${baseURL}/ffmpeg-core.js`,
                      'text/javascript',
                    ),
                    wasmURL: await toBlobURL(
                      `${baseURL}/ffmpeg-core.wasm`,
                      'application/wasm',
                    ),
                    workerURL: await toBlobURL(
                      `${baseURL}/ffmpeg-core.worker.js`,
                      'text/javascript',
                    ),
                  });
                  return;
                } catch (e) {
                  console.warn(
                    '[ascii-export] ffmpeg load failed for',
                    baseURL,
                    e,
                  );
                  lastErr = e;
                }
              }
              throw lastErr ?? new Error('Failed to load ffmpeg core');
            };
            await loadWithFallback();
            for (let i = 0; i < framePngs.length; i += 1) {
              await ffmpeg.writeFile(
                framePngs[i].name,
                await fetchFile(framePngs[i].blob),
              );
            }
            const fr = fps > 0 ? fps : 30;
            await ffmpeg.exec([
              '-framerate',
              String(fr),
              '-i',
              'frame_%04d.png',
              '-c:v',
              'libx264',
              '-pix_fmt',
              'yuv420p',
              '-movflags',
              'faststart',
              'output.mp4',
            ]);
            const data = (await ffmpeg.readFile('output.mp4')) as Uint8Array;
            const outBlob = new Blob([data], { type: 'video/mp4' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(outBlob);
            a.download = 'ascii-video.mp4';
            a.click();
            setTimeout(() => URL.revokeObjectURL(a.href), 1000);
          } catch (e) {
            console.error('ffmpeg assemble failed', e);
            alert(
              '영상 조합 중 오류가 발생했습니다. 콘솔 로그를 확인해주세요.',
            );
          }
        }

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

  const cancelBatch = useCallback(() => {
    abortRef.current = true;
    try {
      const r = activeMediaRecorderRef.current;
      if (r && r.state !== 'inactive') r.stop();
    } catch {}
  }, []);

  return {
    handleRecord,
    handleBatchExport,
    isBatching,
    batchProgress,
    cancelBatch,
  };
};

export default useAsciiRecord;
