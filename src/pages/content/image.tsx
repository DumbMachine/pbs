import React from "react";
import { IPC_EVENTS } from "../background/types";

interface CSPSafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageSrcCSPEnabled?: boolean;
}
const CSPSafeImage: React.FC<CSPSafeImageProps> = ({ src, ...props }) => {
  const id = src?.replace(/[^a-zA-Z0-9]/g, "");
  const tries = React.useRef(0);
  const [imageSrc, setImageSrc] = React.useState(src);

  React.useEffect(() => {
    tries.current = 0;
  }, []);

  const onError = React.useCallback(() => {
    if (tries.current < 3) {
      tries.current += 1;
      // setImageSrc(src);
      chrome.runtime
        .sendMessage({
          type: IPC_EVENTS.RequestImage,
          payload: { url: src },
        })
        .then((res) => {
          console.log({ res });
          // set it has the bg image
          const el = document.getElementById(id!);
          if (el) {
            el.src = res;
            // el.style.backgroundImage = `url(${res})`;
          }
        });
    }
  }, [src]);

  return <img id={id} {...props} src={imageSrc} onError={onError} />;
};

export default CSPSafeImage;
