import React from "react";
import path from "path";
import fs from "fs";

const ImageGrid = () => {
  const filePath = "./images.json";
  const existingContent = fs.readFileSync(filePath, "utf-8"); // Specify the encoding as "utf-8"
  const imageData = JSON.parse(existingContent);
  const imageCount = imageData.length;
  const imageUrls = Array.from(Array(imageCount), (_, i) => {
    const imageName = `image_${i + 1}.jpg`;
    const imagePath = path.join("/images", imageName);
    return imagePath;
  });

  return (
    <div className="image-grid">
      {imageUrls.map((imageUrl, index) => (
        <img
          key={index}
          src={imageUrl}
          alt={`Image ${index + 1}`}
          className="image-item"
          style={{ width: "300px", height: "300px", padding: "10px" }}
        />
      ))}
    </div>
  );
};

export default ImageGrid;

