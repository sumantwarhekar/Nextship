"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function SafeImage({ src, alt, width, height, className, style, ...props }) {
  const [imgSrc, setImgSrc] = useState(src || '/default.png');
  const [hasError, setHasError] = useState(false);

  // Update imgSrc when src prop changes
  useEffect(() => {
    if (src && src !== imgSrc && !hasError) {
      setImgSrc(src);
    }
  }, [src, imgSrc, hasError]);

  const handleError = () => {
    if (!hasError && imgSrc !== '/default.png') {
      setHasError(true);
      setImgSrc('/default.png');
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt || 'Image'}
      width={width}
      height={height}
      className={className}
      style={style}
      onError={handleError}
      {...props}
    />
  );
}