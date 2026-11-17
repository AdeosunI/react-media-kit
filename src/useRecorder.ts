import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

const useRecorder = (streamRef: RefObject<MediaStream | null>) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current?.stop();
      }
    };
  }, []);

  const startRecording = useCallback(
    (callback?: (blob: Blob) => void) => {
      if (!streamRef.current) return;
      mediaRecorderRef.current = new MediaRecorder(streamRef.current!);
      chunks.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunks.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        setIsRecording(false);
        const blob = new Blob(chunks.current, {
          type: mediaRecorderRef.current!.mimeType,
        });
        if (callback) {
          callback(blob);
        }
      };

      mediaRecorderRef.current.onstart = () => {};

      mediaRecorderRef.current.start();

      setIsRecording(true);
    },
    [streamRef],
  );

  const stopRecording = useCallback(() => {
    if (!streamRef.current) return;
    mediaRecorderRef.current?.stop();
  }, [streamRef]);

  const toggleRecording = useCallback(
    (callback?: (blob: Blob) => void) => {
      if (!streamRef.current) return;
      if (!isRecording) {
        startRecording(callback);
      } else {
        stopRecording();
      }
    },
    [isRecording, startRecording, stopRecording, streamRef],
  );

  void streamRef;
  return {
    isRecording,
    toggleRecording,
  };
};

export default useRecorder;
