import { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import './css/Webcam.css';
import './css/Button.css';

const WebcamCapture = () => {
  const webcamRef = useRef<Webcam>(null);

  const [images, setImages] = useState<Array<string>>([]);
  const [ghost, setGhost] = useState<string | null>(null);

  const [showCamera, setShowCamera] = useState(true);

  const capture = useCallback(
    () => {
      if (!webcamRef.current) return;
      const imageSrc = webcamRef.current.getScreenshot() as string;
      setImages(old => [...old, imageSrc]);
      setGhost(imageSrc);
    },
    [webcamRef]
  );

  const toggle = () => {
    setShowCamera(old => !old);
  }
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
        {showCamera
          ? <div>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/png"
              id="webcam"
              videoConstraints={{
                facingMode: "environment"
              }}
            />

            {ghost &&
              <img className="ghost" alt="ghost" src={ghost} />
            }

          </div>
          : <div id="slideshow">
            {images.length
              ? <img id="result" alt="result" src={images[slide]} />
              : <h1>Capture images first!</h1>
            }
          </div>
        }
        <div className="btn-wrapper">
          <button className="btn btn-capture btn-4 btn-4a" onClick={capture}>Capture photo</button>
          <button className="btn btn-slides btn-4 btn-4a" onClick={toggle}>{showCamera ? 'Show slideshow' : 'Show camera'}</button>
        </div>
      </div>
    </>
  );
};

export default WebcamCapture;
