import React from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "environment"
};

const WebcamCapture = () => {
  const webcamRef = React.useRef(null);

  const [images, setImages] = React.useState([]);

  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImages(old => [...old, imageSrc]);
    },
    [webcamRef]
  );

  const generate = () => {
    const encoded = encodeImages(images);
    console.log("================\n", "encoded: ", encoded, "\n================");
  }

  React.useEffect(() => console.log(images), [images]);

  return (
    <>
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
      />
      <button onClick={capture}>Capture photo</button>
      <button onClick={generate}>Generate</button>

      <img id="result" alt="result"/>
    </>
  );
};

const encodeImages = (images) => {
  var encoder = new GIFEncoder();
  encoder.setRepeat(0); //auto-loop
  encoder.setDelay(500);
  console.log(encoder.start());
  console.log(encoder.addFrame("haha"));
  encoder.finish();
  return 'data:image/gif;base64,'+encode64(encoder.stream().getData());
};

export default WebcamCapture;
