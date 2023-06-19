import React from "react";

interface Props {
	progress: number;
	width: number;
	height: number;
}

const ProgressBar: React.FC<Props> = ({ progress, width, height }) => {
	return (
		<>
			<div
				className={"bg-white border-t-2 border-gray-400 border-dotted"}
				style={{
					width: progress * width,
					height: height,
				}}
			></div>
		</>
	);
};

export default ProgressBar;
