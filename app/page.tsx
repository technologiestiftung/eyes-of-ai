import React from "react";
import "../styles/globals.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import ImageGrid from "../components/ImageGrid";

export default function Page() {
  
  return (
    <div>
      <Header />  
      <ImageGrid />
      <Footer />
    </div>
  );
}
