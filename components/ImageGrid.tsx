import React, { useEffect, useState } from "react";

const ImageGrid = () => {
	const [imageData, setImageData] = useState([]); // Initialize the state with an empty array
	const filePath = "/images.json";

	const loadImageData = async () => {
		const response = await fetch(filePath);
		if (!response.ok) throw new Error(response.statusText);
		const data = await response.json();
		setImageData(data);
	};
	useEffect(() => {
		loadImageData().catch(console.error);
	}, []);

	const imageUrls = Array.from(Array(imageData.length), (_, i) => {
		const imageName = `image_${i + 1}.jpg`;
		const imagePath = `/images/${imageName}`;
		return imagePath;
	});

	return (
		<div className="p-20">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{imageUrls.map((imageUrl, index) => (
					<img
						key={index}
						src={imageUrl}
						alt={`Image ${index + 1}`}
						className="image-item"
						style={{ width: "100%", height: "100%" }}
					/>
				))}
			</div>
		</div>
	);
};

export default ImageGrid;
