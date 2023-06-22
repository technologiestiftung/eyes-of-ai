/* eslint-disable @next/next/no-img-element */
import { LocalizedPrompt } from "../pages/api/prompt";
import Loading from "./Loading";
import UserHintBox from "./UserHintBox";
import styles from "../styles/elements.module.css";

interface Props {
	prompt: LocalizedPrompt | undefined;
	imageGenerationInProgress: boolean;
	generatedImageSrc: string | undefined;
	expiresInSeconds: number;
}

const GeneratedImageDisplay: React.FC<Props> = ({
	prompt,
	imageGenerationInProgress,
	generatedImageSrc,
	expiresInSeconds,
}) => {
	if (imageGenerationInProgress || !generatedImageSrc || !prompt) {
		return (
			<div className="w-full h-full">
				<UserHintBox label={"ki malt dich"}></UserHintBox>
				<div className="h-[60%] flex items-center justify-center ">
					<Loading></Loading>
				</div>
				<div className="h-[20%]"></div>
			</div>
		);
	}
	return (
		<div
			className="w-full h-full flex flex-col gap-10"
			style={{ padding: "40px" }}
		>
			<div className="grow">
				<div
					className={`flex items-center justify-center h-full text-center text-2xl`}
				>
					<UserHintBox
						label={
							expiresInSeconds <= 5
								? `reset in ${expiresInSeconds}s`
								: "so sieht dich die ki"
						}
					></UserHintBox>
				</div>
			</div>
			{generatedImageSrc && (
				<div>
					<img
						className="w-full h-auto"
						src={generatedImageSrc}
						alt={prompt.promptDe}
					/>
				</div>
			)}
			{prompt && (
				<div className="grow">
					<div
						className={`flex items-center justify-center h-full text-center text-2xl ${styles.defaultColor}`}
					>
						{prompt.promptDe}
					</div>
				</div>
			)}
		</div>
	);
};

export default GeneratedImageDisplay;
