import React from "react";

interface Props {
	label: string;
	value: number;
}

const UserHintBox: React.FC<Props> = ({ label, value }) => {
	return (
		<>
			<div
				style={{
					position: "absolute",
					zIndex: 100,
					left: 0,
					top: 0,
					fontSize: 80,
					backgroundColor: "red",
				}}
			>
				{label}={Math.round(value * 100) / 100}
			</div>
		</>
	);
};

export default UserHintBox;
