import React from "react";

interface Props {
  progress: number;
  width: number;
  height: number;
}

const ProgressBar: React.FC<Props> = ({ progress, width, height }) => {
  return (
    <>
      <div
        style={{
          width: progress * width,
          height: height,
          backgroundColor: "white",
        }}
      ></div>
    </>
  );
};

export default ProgressBar;
