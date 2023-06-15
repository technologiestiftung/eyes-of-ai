import { LocalizedPrompt } from "../pages/api/prompt";
import styles from "../styles/elements.module.css";
import Loading from "./Loading";
import ProgressBar from "./ProgressBar";

interface Props {
	prompt: LocalizedPrompt | undefined;
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
			{!prompt ? (
				<Loading></Loading>
			) : (
				<div className={styles.generatedImageContainer}>
					<ProgressBar
						progress={expirationProgress}
						width={window.innerWidth}
						height={20}
					></ProgressBar>
					{prompt && <div style={{ width: "50%" }}>{prompt.promptDe}</div>}
					{imageGenerationInProgress && (
						<div style={{ width: "50%", fontSize: "large", padding: "20px" }}>
							Interpretation der KI wird erstellt...
						</div>
					)}
					{generatedImageSrc && (
						<div>
							<img src={generatedImageSrc} alt={prompt} />
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default GeneratedImageDisplay;
