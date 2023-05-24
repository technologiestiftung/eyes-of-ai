import React from "react";
import { Header } from "../components/Header";
import ImageGrid from "../components/ImageGrid";
import imagesData from "../images.json";

export default function Page() {

  // Extract the URLs from the imagesData array
  const imageURLs = imagesData.map((image) => image.url);
  
  return (
    <div>
      <Header />  
      <ImageGrid imageURLs={imageURLs} />
      <p>Lorem ipsum...</p>
    </div>
  );
}
