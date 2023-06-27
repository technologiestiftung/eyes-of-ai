import React from "react";
import { ControlKeyMapping } from "../pages";

interface Props {
	keyShortcut: string;
	controlKeyMapping: ControlKeyMapping;
}

const UserHintBox: React.FC<Props> = ({ keyShortcut, controlKeyMapping }) => {
	return (
		<>
			<div
				style={{
					position: "absolute",
					zIndex: 100,
					left: 0,
					top: 0,
					fontSize: 60,
					backgroundColor: "red",
				}}
			>
				{controlKeyMapping.parameterName} ={" "}
				{Math.round(controlKeyMapping.parameter * 100) / 100}
			</div>
		</>
	);
};

export default UserHintBox;
