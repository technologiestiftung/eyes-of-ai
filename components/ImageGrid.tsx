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
		setImageData(data.slice(0,16));
	};
	useEffect(() => {
		loadImageData().catch(console.error);
	}, []);

	return (
		<div className="p-20" style={{backgroundColor: 'black', color: 'white', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			<div className="grid grid-cols-4 gap-10">
				{imageData &&
					imageData.map(({ id, url, prompt }) => (
						<figure style={{ width: "100%", height: "100%" }} key={id}>
							<img key={id} src={url} alt={prompt} className="image-item" />
							{/* <figcaption>{prompt}</figcaption> */}
						</figure>
					))}
			</div>
		</div>
	);
};

export default ImageGrid;
