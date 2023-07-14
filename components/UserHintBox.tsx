import React from "react";
import styles from "../styles/elements.module.css";

interface Props {
	label: string;
	labelRight: string | undefined;
}

const UserHintBox: React.FC<Props> = ({ label, labelRight }) => {
	return (
		<>
			<div
				className={`grid place-items-center text-3xl font-bold w-full h-[20%] ${styles.defaultColor}`}
			>
				<div className={`text-center h-[20%] ${styles.defaultColor}`}>
					<div className="text-3xl">{label}</div>
					<div className="text-3xl">{labelRight}</div>
				</div>
			</div>
		</>
	);
};

export default UserHintBox;
