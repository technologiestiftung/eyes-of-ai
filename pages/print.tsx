"use client";
import React, { useEffect, useState } from "react";

import useImages from "../hooks/useImages";
import { Database } from "../lib/database";

type Image = Database["public"]["Tables"]["eotai_images"]["Row"];

const PrintPage: React.FC<{}> = ({}) => {
  const PAGE_SIZE = 16;
  const [page, setPage] = useState(0);
  const [allImageData, setAllImageData] = useState<Image[]>([]);
  const { fetchData, isLoading } = useImages();

  const loadImageData = async () => {
    fetchData(page, PAGE_SIZE, (data) => {
      setAllImageData(allImageData.concat(data));
    });
  };

  useEffect(() => {
    loadImageData();
  }, []);

  useEffect(() => {
    loadImageData();
  }, [page]);

  const onShowMoreClick = () => {
    setPage(page + 1);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-black">
        {allImageData.map((image) => (
          <div key={image.id} className="p-4">
            <img
              src={image.url}
              alt={image.prompt}
              className="w-full h-auto rounded-md"
            />
          </div>
        ))}
        <div className="p-4 text-white">
          <button onClick={onShowMoreClick}>Show more</button>
        </div>
      </div>
    </div>
  );
};

export default PrintPage;
