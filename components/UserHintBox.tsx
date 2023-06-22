import React from "react";
import styles from "../styles/elements.module.css";

interface Props {
	label: string;
}

const UserHintBox: React.FC<Props> = ({ label }) => {
	return (
		<>
			<div
				className={`grid place-items-center text-3xl font-bold w-full h-[20%] ${styles.defaultColor}`}
			>
				{label}
			</div>
		</>
	);
};

export default UserHintBox;
