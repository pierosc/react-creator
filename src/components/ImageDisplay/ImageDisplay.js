import React from "react";
function ImageDisplay({ href, target = "_blank", imgSrc, imgAlt, text }) {
  return (
    <div className="relative group cursor-pointer overflow-hidden rounded-xl">
      <a
        href={href}
        target={target}
        rel="noopener noreferrer"
        className="block"
      >
        <img
          // src={require(imgSrc)}
          src={imgSrc}
          alt={imgAlt}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 ease-in-out">
          <span className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            {text}
          </span>
        </div>
      </a>
    </div>
  );
}

export default ImageDisplay;
