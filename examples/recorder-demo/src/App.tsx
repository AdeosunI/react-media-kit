import "./App.css";
import { useRecorder, useStream } from "@adeosuni/react-media-kit";
import Selector from "./components/Selector";
import VideoPlayer from "./components/VideoPlayer";
import handleDownload from "./utils/handleDownload";

function App() {
  const {
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
    handleCameraChangeById,
    handleMicChangeById,
    toggleCamera,
    toggleMicrophone,
  } = useStream();

  const { isRecording, toggleRecording } = useRecorder(streamRef);

  return (
    <main className="device-console">
      <div className="video-shell">
        <button
          type="button"
          className={`record-button ${isRecording ? "is-recording" : ""}`}
          disabled={!streamIsLive}
          onClick={() => {
            toggleRecording((blob) => {
              handleDownload(blob, "recording.webm");
            });
          }}
        >
          {isRecording ? "Stop Recording" : "Record"}
        </button>

        <VideoPlayer
          micIsEnabled={micIsEnabled}
          videoIsEnabled={videoIsEnabled}
          videoRef={videoRef}
          toggleCamera={toggleCamera}
          toggleMicrophone={toggleMicrophone}
        />
      </div>

      <div className="device-selectors">
        <Selector
          id={cameraId}
          onChange={(event) => handleCameraChangeById(event.target.value)}
          devices={cameras}
          type="Camera"
        />

        <Selector
          id={micId}
          onChange={(event) => handleMicChangeById(event.target.value)}
          devices={mics}
          type="Microphone"
        />
      </div>

      {errorMessage && (
        <p className="error-message" role="alert">
          {errorMessage}
        </p>
      )}
    </main>
  );
}

export default App;
