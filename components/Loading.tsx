import React from "react";
import styles from "../styles/loading.module.css";

const Loading: React.FC<{}> = ({}) => {
	return (
		<>
			<div className={styles.ldsGrid}>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</>
	);
};

export default Loading;
