# Create and Edit Video using the CreativeEditor SDK

The CE.SDK Video Mode allows users to edit videos in a manner familiar from popular platforms such as TikTok or Instagram. The CE.SDK editor contains a full-featured video editor, complete with Video and Audio trimming and composition capabilities. This guide introduces you to the core concepts.

For API calls related to video editing, refer to the engine guide on video editing.

To understand the Video Editor UI, skip to the UI overview.

**Demo:** [View Demo](https://react-wasm-video-editor.netlify.app/)

## A Note on Browser Support

Video mode heavily relies on modern features like web codecs and is currently supported in the latest versions of Google Chrome, Microsoft Edge, or other Chromium-based browsers.

## Editor Setup

### Add Demo Asset Sources

When using `cesdk.addDemoAssetSources()`, ensure that you specify the correct scene mode. The installed demo asset sources vary between Design and Video modes.

If you don't specify a scene mode, `addDemoAssetSources()` will try to add the correct sources based on the current scene, defaulting to 'Design'. If you call `addDemoAssetSources()` without a scene mode before loading or creating a video scene, the audio and video asset sources won't be added.

### Create or Load a Video Scene

To switch the editor to video mode:
- Create an empty video scene using `cesdk.createVideoScene()`.
- If you already have a video scene, loading it with `loadFromUrl()` or `loadFromString()` will also switch the editor to video mode.

### Set the Default Page Duration

By default, a page in video mode has a duration of 5 seconds. To change this, set the `scene/defaultPageDuration` property on the Scene block to the desired default duration when adding a new Page to the Scene.

## UI Overview

### Timeline

The timeline is the main control for video editing. Pages and audio strips can be positioned in time. Pages run along the top of the timeline, while audio strips run along the bottom. Click anywhere inside the timeline to set the playback time or drag the seeker directly. Use the play button to view the final result.

### Pages in Video Mode

Pages contain visual elements of the design, spread out over time in video mode. Only one page is visible at a time. Page content displays for the entire duration. If a video clip is longer than the page, it's cut off at the end. If shorter, the video loops for the page duration. A page's length is limited to 30 minutes by default.

### Editing Pages

- Adjust page duration by dragging strip handles.
- Change page order using the context menu on the page strip.

### Video

Videos are added via the Asset Library and positioned on the page. A video runs for the entire page duration. Use trim controls to select a specific video section to play.

### Trimming Videos

Trim controls appear at the top of the editor window. While open, only the selected video plays during seeking or playback. Adjust start and end time by dragging handles. Grayed-out area won't be shown. Blue overlay indicates the page duration's end.

⚠️ Video snippets longer than the page are cut short.
⚠️ Short video snippets are looped.

### Audio

Audio is only shown in the timeline as audio strips. It stretches across multiple pages. Use the timeline to edit audio:

- Drag strip handles to adjust start and end time.
- Drag the strip center to position.
- Use the strip context menu to delete or replace audio content.

### Trimming Audio

Trimming audio works like trimming video.

This guide provides a comprehensive overview of using the CE.SDK Video Mode for creating and editing videos.
