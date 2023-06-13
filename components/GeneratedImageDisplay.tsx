import styles from "../styles/elements.module.css";
import ProgressBar from "./ProgressBar";

interface Props {
	prompt: string;
	imageGenerationInProgress: boolean;
	generatedImageSrc: string | undefined;
	expirationProgress: number;
}

const GeneratedImageDisplay: React.FC<Props> = ({
	prompt,
	imageGenerationInProgress,
	generatedImageSrc,
	expirationProgress,
}) => {
	return (
		<div className={styles.generatedImageContainer}>
			<ProgressBar
				progress={expirationProgress}
				width={window.innerWidth}
				height={20}
			></ProgressBar>
			<div style={{ width: "50%" }}>{prompt}</div>
			{imageGenerationInProgress && (
				<div style={{ width: "50%", fontSize: "large", padding: "20px" }}>
					Generating AI interpretation...
				</div>
			)}
			{generatedImageSrc && (
				<div>
					<img src={generatedImageSrc} alt={prompt} />
				</div>
			)}
		</div>
	);
};

export default GeneratedImageDisplay;
