import React, { useEffect, useState } from "react";

import usePaginatedImages from "../hooks/usePaginatedImages";
import { Database } from "../lib/database";

type Image = Database["public"]["Tables"]["eotai_images"]["Row"];

interface Props {
  showCaption: boolean;
  showMoreButton: boolean;
}

const ImageGrid: React.FC<Props> = ({ showCaption, showMoreButton }) => {
  const PAGE_SIZE = 16;
  const [page, setPage] = useState(0);
  const [allImageData, setAllImageData] = useState<Image[]>([]);
  const { fetchPaginatedImages } = usePaginatedImages();

  useEffect(() => {
    fetchPaginatedImages(page, PAGE_SIZE, (data) => {
      setAllImageData((prevImageData) => prevImageData.concat(data));
    });
  }, [fetchPaginatedImages, page]);

  const onShowMoreClick = () => {
    setPage(page + 1);
  };
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-black">
        {allImageData.map((image) => (
          <div key={image.id} className="p-4 text-white">
            <figure>
              <img
                src={image.url}
                alt={image.prompt}
                className="w-full h-auto rounded-md"
              />
              {showCaption && <figcaption>{image.prompt}</figcaption>}
            </figure>
          </div>
        ))}
        {showMoreButton && onShowMoreClick && (
          <div className="p-4 text-white">
            <button onClick={onShowMoreClick}>Show more</button>
          </div>
        )}
      </div>
    </>
  );
};

export default ImageGrid;
