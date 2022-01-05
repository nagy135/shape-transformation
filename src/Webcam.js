import { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "environment"
};

const WebcamCapture = () => {
  const webcamRef = useRef(null);

  const [images, setImages] = useState([]);
  const [ghost, setGhost] = useState(null);

  const capture = useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImages(old => [...old, imageSrc]);
      setGhost(imageSrc);
    },
    [webcamRef]
  );

  const [slide, setSlide] = useState(0);

  useEffect(() => {

    const intId = setInterval(() => {
      setSlide(old => {
        const total = isNaN(images.length) || images.length === 0 ? 1 : images.length;
        const newId = (old + 1) % total;

        const imgs = document.querySelectorAll("div#slideshow > img");


        for (let i = 0; i < imgs.length; i++) {
          let img = imgs[i];
          img.style.display = 'none';
        }
        const selectedOne = document.querySelector('div#slideshow > img[i="' + newId + '"]');
        if (selectedOne) selectedOne.style.display = 'block';

        return newId;
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
        {images.map((imageSrc, i) => <img style={{ position: 'absolute', top: 800, display: i == 0 ? 'default' : 'none' }} i={i} key={i} id="result" alt="result" src={imageSrc} />)}
      </div>
    </>
  );
};

export default WebcamCapture;
