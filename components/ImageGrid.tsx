/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";

import usePaginatedImages from "../hooks/usePaginatedImages";
import { Database } from "../lib/database";
import Figure from "./Figure";

type Image = Database["public"]["Tables"]["eotai_images"]["Row"];

interface Props {
	showCaption: boolean;
	showMoreButton: boolean;
}

const ImageGrid: React.FC<Props> = ({ showCaption, showMoreButton }) => {
	const PAGE_SIZE = 9;
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
			<div className="grid grid-cols-1 gap-2 m-auto sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{allImageData.map((image) => (
					<div key={image.id} className="p-4">
						<Figure
							src={image.url}
							alt={image.prompt_de ?? image.prompt}
							caption={image.prompt_de ?? image.prompt}
							showCaption={showCaption}
						/>
						{/* <figure>
							<img
								src={image.url}
								alt={image.prompt_de ?? image.prompt}
								className="w-full h-auto"
							/>
							{showCaption && (
								<figcaption className="text-left">
									{image.prompt_de ?? image.prompt}
								</figcaption>
							)}
						</figure> */}
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
