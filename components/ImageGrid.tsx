import React, { useEffect, useState } from "react";
import { anonClient } from "../lib/supabase";
import { Database } from "../lib/database";

type Image = Database["public"]["Tables"]["eotai_images"]["Row"];
const ImageGrid = () => {
	const [imageData, setImageData] = useState<Image[]>(null); // Initialize the state with an empty array
	// const filePath = "/images.json";

	const loadImageData = async () => {
		const { data, error } = await anonClient.from("eotai_images").select("*");
		if (error) throw new Error(error.message);
		setImageData(data);
	};
	useEffect(() => {
		loadImageData().catch(console.error);
	}, []);

	return (
		<div className="p-20">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{imageData &&
					imageData.map(({ id, url, prompt }) => (
						<figure style={{ width: "100%", height: "100%" }}>
							<img key={id} src={url} alt={prompt} className="image-item" />
							<figcaption>{prompt}</figcaption>
						</figure>
					))}
			</div>
		</div>
	);
};

export default ImageGrid;
