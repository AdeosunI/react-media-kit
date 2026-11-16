# Recorder Demo

<a href="https://stackblitz.com/github/AdeosunI/react-media-kit?file=examples%2Frecorder-demo%2Fsrc%2FApp.tsx&startScript=recorder-demo" target="_blank" rel="noopener noreferrer">
  <img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" alt="Open in StackBlitz" />
</a>

A browser-based example and showcase for [`@adeosuni/react-media-kit`](https://github.com/AdeosunI/react-media-kit), demonstrating how to capture, preview, control, and record audio and video streams. Choose a camera and microphone, preview the live stream, toggle either device, and record the stream to a video file.

## Requirements

- Node.js and npm
- A modern browser with camera and microphone access

## Run locally

Already cloned the repository? Skip step 1. Already installed dependencies from the repository root? Skip step 2.

1. Clone the repository and open its root directory.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the recorder demo's Vite development server from the repository root:

   ```bash
   npm run dev --workspace=recorder-demo
   # Shorthand:
   npm run dev -w recorder-demo
   ```

4. Open the local URL printed in the terminal (usually `http://localhost:5173`).
5. Allow the browser to access your camera and microphone when prompted.

Use the device selectors to choose your camera and microphone. Select **Record** to begin recording and **Stop Recording** to finish and download it.

## Other commands

```bash
npm run build -w recorder-demo    # Type-check and create a production build
npm run preview -w recorder-demo  # Serve the production build locally
npm run lint -w recorder-demo     # Run ESLint
```
