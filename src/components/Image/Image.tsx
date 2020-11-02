import React, { useEffect, useState } from 'react';

interface ImageProps
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  width?: number | string;
  height?: number | string;
}

const Image = ({ className, src, width, height, ...restProps }: ImageProps) => {
  let [base64Image, setBase64Image] = useState<String | null>(null);

  const loadData = () => {
    const message = { method: 'requestBase64Image', arguments: { src } };
    const responseCallback = ({ base64Image, error }: any) => {
      setBase64Image(base64Image);
      console.log(base64Image);
    };
    chrome.runtime.sendMessage(message, responseCallback);
  };

  useEffect(() => {
    if (!src) return;
    loadData();
  }, [src]);

  return (
    <img
      className={className}
      src={`${base64Image}`}
      alt=""
      style={{
        width,
        height,
      }}
      {...restProps}
    />
  );
};

export default Image;
