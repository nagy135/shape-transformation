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

  const capture = useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImages(old => [...old, imageSrc]);
    },
    [webcamRef]
  );

  const [slide, setSlide] = useState(0);
  let [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (intervalId) clearInterval(intervalId);

    setIntervalId(setInterval(() => {
      setSlide(old => {
        const total = isNaN(images.length) || images.length === 0 ? 1 : images.length;
        const newId = (old + 1) % total;

        const imgs = document.querySelectorAll("div#slideshow > img");


        for (let i = 0; i < imgs.length; i++) {
          let img = imgs[i];
          img.style.display = 'none';
        }
        const selectedOne = document.querySelector('div#slideshow > img[i="'+ newId + '"]');
        if (selectedOne) selectedOne.style.display = 'block';

        return newId;
      });
    }, 300));
  }, [images]);


  useEffect(() => console.log(images), [images]);

  return (
    <>
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/png"
        width={1280}
        videoConstraints={videoConstraints}
      />
      <button onClick={capture}>Capture photo</button>

      <div id="slideshow">
        {images.map((imageSrc, i) => <img style={{ display: i == 0 ? 'default' : 'none' }} i={i} key={i} id="result" alt="result" src={imageSrc} />)}
      </div>
    </>
  );
};

export default WebcamCapture;
