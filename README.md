# Create and Edit Video using the CreativeEditor SDK

**Demo:** [View Demo](https://react-wasm-video-editor.netlify.app/)

CE.SDK Video Mode allows your users to edit videos in a manner familiar from popular platforms such as TikTok or Instagram. The CE.SDK editor contains a full-featured video editor, complete with Video and Audio trimming, and composition capabilities. Get to know the core concepts in this guide.

To learn about the **available API calls** related to video editing, see the [engine guide on video editing](https://img.ly/docs/cesdk/engine/guides/video/).

To learn about the **Video Editor UI**, skip to the [UI overview](#ui-overview).

### A Note on Browser Support

Video mode heavily relies on modern features like web codecs,
and as such is currently only supported in the latest versions of
Google Chrome, Microsoft Edge, or other Chromium-based browsers.

## Editor Setup

### Add demo asset sources

When adding demo asset sources using `cesdk.addDemoAssetSources()`, make sure to specify the correct scene mode. The installed demo asset sources vary between Design and Video modes.

If you don't specify a scene mode, `addDemoAssetSources()` will try to add the correct sources based on the current scene, and default to 'Design'. If you call `addDemoAssetSources()` _without_ a scene mode, and _before_ loading or creating a video scene, the audio and video asset sources will not be added.

### Create or load a video scene

To switch the editor to video mode, create an empty video scene using `cesdk.createVideoScene()`. If you already have a video scene, loading it with `loadFromUrl()` or `loadFromString()` will switch the editor to video mode as well.

### Set the default Page Duration

By default, a page in video mode has a duration of 5 seconds. To change this, we can set the `scene/defaultPageDuration` property on the Scene block to the desired default duration we want to have when adding a new Page to the Scene.

And that's it!

## UI Overview

### Timeline

![The editor timeline control.](https://img.ly/docs/cesdk/620c8c66c19072264b2f7b60ffb92236/video_mode_timeline.png)

The timeline is the main control for video editing. It is here that pages and audio strips can be positioned in time. Pages run along the top of the timeline, while audio strips run along the bottom. Click anywhere inside the timeline to set the playback time, or drag the seeker directly. Use the play button to view the final result.

### Pages in Video Mode

Just like in regular design mode, pages contain all visual elements of the design (audio is not contained in pages). Pages are spread out over time in video mode - only one page is visible at a time. The content of a page will be displayed for the entire duration of the page. If a video clip is longer than the page, it will be cut off at the end. If it is shorter, the video will loop for the duration of the page. The length of a page is limited to 30 minutes by default (configurable by [this options](https://img.ly/docs/cesdk/ui/guides/elements/#pages)).

#### Editing pages

Pages can be added, removed, and edited using the timeline controls:
- Page duration can be adjusted by dragging the page strip handles.
- The order of pages can be changed using the context menu on the page strip.

### Video

Videos are handled in a similar fashion to regular elements: You can add them via the Asset Library and position them anywhere on the page. A video will run for the entire duration of the page. You can select a specific section of video to play using the trim controls (pictured below), accessible by pressing the trim button.

#### Trimming videos

![The trim controls for video.](https://img.ly/docs/cesdk/99df9a33df4d9e847b319866b2f48685/video_mode_trim_controls.png)

Trim controls will appear near the top of the editor window.
- While these controls are open, **only the selected video is played** during seeking or playback.
- You can **adjust the start and end time** by dragging the handles on either side of the strip.
- The **grayed-out area** indicates the parts of the video that won't be shown.
- The **blue overlay** indicates the end of the page duration - to show these parts of the video, extend the duration of the containing page.
    - ⚠️ Video snippets that run longer than the containing page will be cut short.
    - ⚠️ Video snippets that are shorter than the containing page will be looped.

### Audio

![A timeline containing audio strips.](https://img.ly/docs/cesdk/d4b765137b03e5679481a0503620ea90/video_mode_audio_strips.png)

Unlike regular design elements, audio is not visible on the canvas. It is only shown in the timeline, as audio strips. Audio is also not contained on a single page (like Video is), but can stretch across multiple pages. Use the timeline to edit audio:
- Drag either of the strip handles to **adjust start and end time**.
- Drag the center of the strip to **position the strip**.
- Use the context menu on the strip to **delete or replace audio content**.

#### Trimming audio

![The trim controls for audio.](https://img.ly/docs/cesdk/9357ee451101c417f59018f0f93bba1f/video_mode_audio_trim.png)

Trimming audio works just like [trimming video](#trimming-videos).
