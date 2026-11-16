import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useEffectEvent,
} from "react";

const useStream = () => {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [mics, setMics] = useState<MediaDeviceInfo[]>([]);
  const [cameraId, setCameraId] = useState<string | null>(null);
  const [micId, setMicId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [streamIsLive, setStreamIsLive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [micIsEnabled, setMicIsEnabled] = useState(false);
  const [videoIsEnabled, setVideoIsEnabled] = useState(false);
  const streamRequestIdRef = useRef(0);
  const deviceEnumerationRequestIdRef = useRef(0);

  const showStream = useCallback(
    async (constraints: MediaStreamConstraints) => {
      const nextCameraId = getDeviceIdFromConstraints(constraints, "video");
      const nextMicId = getDeviceIdFromConstraints(constraints, "audio");
      const streamRequestId = ++streamRequestIdRef.current;

      try {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        setVideoIsEnabled(false);
        setMicIsEnabled(false);
        setStreamIsLive(false);

        setCameraId(nextCameraId);
        setMicId(nextMicId);

        const nextStream =
          await navigator.mediaDevices.getUserMedia(constraints);

        if (streamRequestId !== streamRequestIdRef.current) {
          nextStream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = nextStream;
        if (videoRef.current) videoRef.current.srcObject = nextStream;

        setCameraId(
          nextStream.getVideoTracks()[0]?.getSettings().deviceId ?? null,
        );
        setMicId(
          nextStream.getAudioTracks()[0]?.getSettings().deviceId ?? null,
        );
        setVideoIsEnabled(true);
        setMicIsEnabled(true);
        setStreamIsLive(true);
        setErrorMessage("");

        return nextStream;
      } catch (error) {
        if (streamRequestId !== streamRequestIdRef.current) {
          return;
        }
        console.error("Could not access media devices.", error);
        setErrorMessage("Could not access the selected camera or microphone.");
        return null;
      }
    },
    [],
  );

  const handleDeviceChange = useEffectEvent(async () => {
    const deviceEnumerationRequestId = ++deviceEnumerationRequestIdRef.current;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      if (deviceEnumerationRequestId !== deviceEnumerationRequestIdRef.current)
        return;

      const nextCameras = devices.filter((d) => d.kind === "videoinput");
      const nextMics = devices.filter((d) => d.kind === "audioinput");

      setCameras(nextCameras);
      setMics(nextMics);

      const nextCameraId = nextCameras.some((d) => d.deviceId === cameraId)
        ? cameraId
        : (nextCameras[0]?.deviceId ?? null);

      const nextMicId = nextMics.some((d) => d.deviceId === micId)
        ? micId
        : (nextMics[0]?.deviceId ?? null);

      if (nextCameraId !== cameraId || nextMicId !== micId) {
        if (nextCameraId && nextMicId) {
          await showStream({
            video: { deviceId: { exact: nextCameraId } },
            audio: { deviceId: { exact: nextMicId } },
          });
        }
      }
    } catch {
      if (
        deviceEnumerationRequestId === deviceEnumerationRequestIdRef.current
      ) {
        setErrorMessage("Could not read the available media devices.");
      }
    }
  });

  useEffect(() => {
    async function initialize() {
      const stream = await showStream({ video: true, audio: true });
      if (!stream) return;

      handleDeviceChange();
    }

    const handler = () => {
      handleDeviceChange();
    };

    void initialize();
    navigator.mediaDevices.addEventListener("devicechange", handler);

    return () => {
      streamRequestIdRef.current++;
      deviceEnumerationRequestIdRef.current++;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      navigator.mediaDevices.removeEventListener("devicechange", handler);
    };
  }, [showStream]);

  function handleCameraChange(
    cameraConstraints: NonNullable<MediaStreamConstraints["video"]>,
  ) {
    showStream({
      video: cameraConstraints,
      audio: micId !== null ? { deviceId: { exact: micId } } : false,
    });
  }

  function handleMicChange(
    micConstraints: NonNullable<MediaStreamConstraints["audio"]>,
  ) {
    showStream({
      video: cameraId !== null ? { deviceId: { exact: cameraId } } : false,
      audio: micConstraints,
    });
  }

  const toggleCamera = useCallback(() => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0]!.enabled = !videoTracks[0]!.enabled;
        setVideoIsEnabled(videoTracks[0]!.enabled);
      }
    }
  }, [setVideoIsEnabled, streamRef]);

  const toggleMicrophone = useCallback(() => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0]!.enabled = !audioTracks[0]!.enabled;
        setMicIsEnabled(audioTracks[0]!.enabled);
      }
    }
  }, [setMicIsEnabled, streamRef]);

  return {
    cameras,
    mics,
    cameraId,
    micId,
    errorMessage,
    videoRef,
    streamRef,
    micIsEnabled,
    videoIsEnabled,
    streamIsLive,
    handleCameraChange,
    handleMicChange,
    toggleCamera,
    toggleMicrophone,
  };
};

export default useStream;

const getDeviceIdFromConstraints = (
  constraints: MediaStreamConstraints,
  kind: "audio" | "video",
): string | null => {
  if (typeof constraints[kind] === "object") {
    if (typeof constraints[kind].deviceId === "string") {
      return constraints[kind].deviceId;
    }
    if (
      typeof constraints[kind].deviceId === "object" &&
      "ideal" in constraints[kind].deviceId &&
      typeof constraints[kind].deviceId.ideal === "string"
    ) {
      return constraints[kind].deviceId.ideal;
    }
  }
  return null;
};
