import { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import './css/Webcam.css';

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
      <div id="total-wrapper">
        <Webcam
          audio={false}
          height={720}
          ref={webcamRef}
          screenshotFormat="image/png"
          width={1280}
          videoConstraints={{
            width: 1280,
            height: 720,
            facingMode: "environment"
          }}
        />
        <button id="capture-btn" onClick={capture}>Capture photo</button>

        {ghost &&
          <img key="ghost" className="ghost" alt="ghost" src={ghost} />
        }

        <div id="slideshow">
          {images.length &&
            <img id="result" alt="result" src={images[slide]} />
          }
        </div>
      </div>
    </>
  );
};

export default WebcamCapture;
