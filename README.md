# React Media Kit

A collection of React hooks for capturing, recording, and streaming audio and video using browser media APIs and WebRTC.

## Hooks

### [`useStream`](./src/useStream.ts)

Requests and manages a live camera/microphone stream. It exposes available devices, the stream and video refs, stream status, and handlers for selecting devices and toggling their tracks.

### [`useRecorder`](./src/useRecorder.ts)

Records a `MediaStream` using the browser's `MediaRecorder` API. It exposes recording status and start/stop handlers; stopping a recording downloads it as `recording.webm`.

## Examples

### Recorder demo

A browser-based showcase with camera and microphone selection, live preview, device controls, and recording.

**App source:** [`examples/recorder-demo/src/App.tsx`](./examples/recorder-demo/src/App.tsx)  
**Local setup:** [Recorder demo README](./examples/recorder-demo/README.md)

<a href="https://stackblitz.com/github/AdeosunI/react-media-kit?file=examples%2Frecorder-demo%2Fsrc%2FApp.tsx&startScript=recorder-demo" target="_blank" rel="noopener noreferrer">
  <img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" alt="Open the recorder demo in StackBlitz" />
</a>
