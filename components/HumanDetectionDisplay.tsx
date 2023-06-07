import React, { useMemo } from "react";
import { useEyesOfAIStore } from "../store";

interface Props {
	videoRef: React.MutableRefObject<HTMLVideoElement>;
	canvasRef: React.MutableRefObject<HTMLCanvasElement>;
}

const HumanDetectionDisplay: React.FC<Props> = ({ videoRef, canvasRef }) => {
	const result = useEyesOfAIStore((state) => state.result);
	const triggered = useEyesOfAIStore((state) => state.trigger);
	const firstStillTime = useEyesOfAIStore((state) => state.firstStandStillTime);
	const msInStill = useEyesOfAIStore((state) => state.msInStandStill);

	const detectionText = useMemo(() => {
		const text = result?.face.map((face) => {
			const distinctGestures = result.gesture.map(({ gesture }) => gesture.toString()).filter((x, i, a) => a.indexOf(x) == i)

			const coreLabel = `${Math.round(face.age)} years old ${face.gender} person`
			const emotionLabel = `${face.emotion.map(({ emotion, score }) => `${Math.round(score * 100)}% ${emotion}`).join(', ')}`
			const gesturesLabel = `${distinctGestures.join(', ')}`

			return [coreLabel, emotionLabel, gesturesLabel]
		})[0]
		return text
	}, [result])

	return <>
		<div style={{ backgroundColor: 'black', color: 'white', fontSize: 'xx-large', textAlign: 'center', width: '100vw'}}>
			{!triggered &&
				firstStillTime ? 
				<div>
					<div style={{width: `calc(${Math.min(100, msInStill / 2000)} * 100vw)`, height: '20px', backgroundColor: 'white'}}></div>
					<div>Stay like this!</div>
				</div>	
				 : <div style={{paddingTop: '20px'}}>Stay still!</div>
			}
			{triggered && <div>'Triggered'</div>}
		</div>
		<div style={{ display: 'flex', width: '100vw', height: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', backgroundColor: 'black', color: 'white', fontSize: 'xx-large' }}>
			<div>
				{detectionText?.map((label) => <p>{label}</p>)}
			</div>
		</div>
	</>;
};

export default HumanDetectionDisplay;
