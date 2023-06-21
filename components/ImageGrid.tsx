/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";

import usePaginatedImages from "../hooks/usePaginatedImages";
import { Database } from "../lib/database";

type Image = Database["public"]["Tables"]["eotai_images"]["Row"];

interface Props {
	showCaption: boolean;
	showMoreButton: boolean;
}

const ImageGrid: React.FC<Props> = ({ showCaption, showMoreButton }) => {
	const PAGE_SIZE = 30;
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

	if (!allImageData) return null;
	if (allImageData.length === 0) return null;

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 bg-white flex h-screen gap-1">
				{allImageData.slice(0, 6).map((image) => (
					<div key={image.id} className=" m-auto text-white">
						<figure>
							<img
								src={image.url}
								alt={image.prompt_de ?? image.prompt}
								className="w-full h-auto rounded-md"
							/>
							{showCaption && (
								<figcaption>{image.prompt_de ?? image.prompt}</figcaption>
							)}
						</figure>
					</div>
				))}

				<div
					key={allImageData[0].id}
					className="w-full h-full col-start-2 col-span-3 row-span-4 bg-white"
				>
					<div className="grid"></div>
				</div>

				{allImageData.slice(6, 18).map((image) => (
					<div key={image.id} className=" m-auto text-white">
						<figure>
							<img
								src={image.url}
								alt={image.prompt_de ?? image.prompt}
								className="w-full h-auto rounded-md"
							/>
							{showCaption && (
								<figcaption>{image.prompt_de ?? image.prompt}</figcaption>
							)}
						</figure>
					</div>
				))}
			</div>
		</>
	);
};

export default ImageGrid;
