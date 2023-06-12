"use client";
import React from "react";
import ImageGrid from "../components/ImageGrid";

const PrintPage: React.FC<{}> = ({}) => {
	return (
		<div>
			<ImageGrid showCaption={true} showMoreButton={true}></ImageGrid>
		</div>
	);
};

export default PrintPage;
