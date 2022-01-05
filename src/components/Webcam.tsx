import { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "environment"
};

const WebcamCapture = () => {
  const webcamRef = useRef<Webcam>(null);

  const [images, setImages] = useState<Array<string>>([]);
  const [ghost, setGhost] = useState<string | null>(null);

  const capture = useCallback(
    () => {
      if (!webcamRef.current) return;
      const imageSrc = webcamRef.current.getScreenshot() as string;
      setImages(old => [...old, imageSrc]);
      setGhost(imageSrc);
    },
    [webcamRef]
  );

  const [slide, setSlide] = useState(0);

  useEffect(() => {

    const intId = setInterval(() => {
      setSlide(old => {
        return (old + 1) % (images.length || 1);
      });
    }, 300);
    return () => { if (intId) clearInterval(intId) };
  }, [images]);

  return (
    <>
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/png"
        width={1280}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
        }}
        videoConstraints={videoConstraints}
      />
      <button style={{ position: 'absolute', top: 0, right: 0, zIndex: 9999 }} onClick={capture}>Capture photo</button>

      {ghost &&
        <img style={{
          position: 'absolute',
          left: 0,
          top: 0,
          opacity: 0.5
        }} key="ghost" id="ghost" alt="result" src={ghost} />
      }

      <div id="slideshow">
        {images.length &&
          <img style={{ position: 'absolute', top: 800 }} id="result" alt="result" src={images[slide]} />
        }
      </div>
    </>
  );
};

export default WebcamCapture;
