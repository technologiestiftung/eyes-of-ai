import React, { useMemo } from "react";
import { useEyesOfAIStore } from "../store";
import styles from "../styles/elements.module.css";

interface Props {
	progress: number;
	width: number;
	height: number;
}

const ProgressBar: React.FC<Props> = ({ progress, width, height }) => {
	return <>
		<div style={{width: progress * width, height: height, backgroundColor: 'white'}}></div>
	</>;
};

export default ProgressBar;
