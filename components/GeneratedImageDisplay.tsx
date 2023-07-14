/* eslint-disable @next/next/no-img-element */
import { DetectionFacts } from "../hooks/useDetectionText";
import { LocalizedPrompt } from "../pages/api/prompt";
import DetectionBox from "./DetectionBox";
import Loading from "./Loading";
import UserHintBox from "./UserHintBox";

interface Props {
	prompt: LocalizedPrompt | undefined;
	detectionFacts: DetectionFacts | undefined;
	imageGenerationInProgress: boolean;
	generatedImageSrc: string | undefined;
	expiresInSeconds: number;
}

const GeneratedImageDisplay: React.FC<Props> = ({
	prompt,
	detectionFacts,
	imageGenerationInProgress,
	generatedImageSrc,
	expiresInSeconds,
}) => {
	if (imageGenerationInProgress || !generatedImageSrc || !prompt) {
		return (
			<div className="w-full h-full">
				<UserHintBox
					label={"gesicht erfasst"}
					labelRight={"ki malt dich"}
				></UserHintBox>
				<div className="h-[60%] flex items-center justify-center ">
					<Loading></Loading>
				</div>
				<div className="h-[20%]"></div>
			</div>
		);
	}
	return (
		<div className="w-full h-full flex flex-col" style={{ padding: "40px" }}>
			<div className="grow">
				<div>
					<UserHintBox
						label={
							expiresInSeconds <= 5
								? `reset in ${expiresInSeconds}s`
								: "so sieht dich die ki"
						}
						labelRight={undefined}
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
			{detectionFacts && (
				<div style={{ paddingTop: "20px" }}>
					<DetectionBox
						detectionFacts={detectionFacts}
						showGesture={true}
						showMouth={true}
					></DetectionBox>
				</div>
			)}
		</div>
	);
};

export default GeneratedImageDisplay;
