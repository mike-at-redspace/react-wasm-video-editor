import { useVideoEditor } from "./hooks/useVideoEditor";

const VideoEditor = () => {
  const { cesdk_container } = useVideoEditor();

  return (
    <div style={cesdkWrapperStyle}>
      <div ref={cesdk_container} style={cesdkStyle}></div>
    </div>
  );
};

const cesdkStyle = {
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const cesdkWrapperStyle = {
  position: "relative",
  overflow: "hidden",
  flexGrow: 1,
  display: "flex",
  borderRadius: "0.75rem",
  boxShadow:
    "0px 0px 2px rgba(0, 0, 0, 0.25), 0px 18px 18px -2px rgba(18, 26, 33, 0.12), 0px 7.5px 7.5px -2px rgba(18, 26, 33, 0.12), 0px 3.75px 3.75px -2px rgba(18, 26, 33, 0.12)",
  minHeight: "740px",
};

export default VideoEditor;
