import React from "react";
import { Header } from "../components/Header";
import ImageGrid from "../components/ImageGrid";
import imagesData from "../images.json";

export default function Page() {
  
  return (
    <div>
      <Header />  
      <ImageGrid />
      <p>Lorem ipsum...</p>
    </div>
  );
}
