/* eslint-disable @next/next/no-img-element */
import { LocalizedPrompt } from "../pages/api/prompt";
import Figure from "./Figure";
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
		<div className="flex flex-col items-center justify-center h-screen text-2xl text-center">
			{imageGenerationInProgress ? (
				<>
					<Loading></Loading>
					<div className="w-1/2 py-5 text-lg">
						Ein Interpretation der KI von dir wird erstellt...
					</div>
				</>
			) : (
				<div className="flex flex-col items-center justify-center text-2xl text-center">
					<div className="w-1/2 py-5">
						<ProgressBar
							progress={expirationProgress}
							width={512}
							height={10}
						></ProgressBar>
						{generatedImageSrc && (
							<Figure
								src={generatedImageSrc}
								alt={prompt.promptDe ?? prompt.promptEn}
								caption={prompt.promptDe ?? prompt.promptEn}
								showCaption={true}
							/>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default GeneratedImageDisplay;
