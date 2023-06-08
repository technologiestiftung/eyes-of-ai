import { useEffect, useState } from "react";
import { Body } from "../pages/api/prompt";
import { useEyesOfAIStore } from "../store";
import styles from "../styles/elements.module.css";
import ProgressBar from "./ProgressBar";

const ImageGenerator: React.FC<{ csrf: string }> = ({ csrf }) => {
	const EXPIRATION_SECONDS = 20;
	const result = useEyesOfAIStore((state) => state.result);
	const shouldTrigger = useEyesOfAIStore((state) => state.trigger);
	const [prompt, setPrompt] = useState<string>("");
	const [apiData, setApiData] = useState<Record<string, unknown> | null>(null);
	const [imageSrc, setImageSrc] = useState<string>("");
	const [imageGeneratedTime, setImageGeneratedTime] = useState<Date>();
	const [expirationProgress, setExpirationProgress] = useState<number>(0.0);
	const setGeneratedImageExpired = useEyesOfAIStore((state) => state.setGeneratedImageExpired);

	useEffect(() => {
		if (shouldTrigger) {
			createPrompt()
		}
	}, [shouldTrigger]);

	useEffect(() => {
		if (prompt && imageSrc === '') {
			createImage();
		}
	}, [prompt])

	const createImage: () => Promise<void> = async () => {
		if (prompt === "") {
			setApiData({ prompt: "Please enter a prompt" });
		}
		console.log("Creating image from prompt:", prompt);
		try {
			const response = await fetch("/api/images", {
				method: "POST",

				headers: {
					"Content-Type": "application/json",
					"X-CSRF-Token": csrf,
				},
				body: JSON.stringify({
					prompt: prompt,
				}),
			});
			if (!response.ok) {
				const txt = await response.json();

				setApiData({ error: txt, status: response.status });
				return;
			}
			const data = await response.json();
			setApiData(data);
			if (data.data?.url) {
				setImageSrc(data.data.url);
			}
			setImageGeneratedTime(new Date())
		} catch (error) {
			console.log(error, "Error in fetch");
		}
	};

	const createPrompt: () => Promise<void> = async () => {
		const gestures = result.gesture.map((item) => item.gesture);
		const emotions = result.face[0].emotion.map((e) => e.emotion);
		const age = result.face[0].age;

		const gender =
			result.face[0].gender === "unknown" || result.face[0].genderScore < 0.6
				? "non-binary"
				: result.face[0].gender;
		const randomGenderPercentage = Math.floor(Math.random() * 100);
		try {
			const body: Body = {
				age,
				gender,
				emotions,
				gestures,
			};
			const response = await fetch("/api/prompt", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-Token": csrf,
				},
				body: JSON.stringify(body),
			});
			if (!response.ok) {
				const txt = await response.json();

				setApiData({ error: txt, status: response.status });
				return;
			}

			const data = await response.json();
			setApiData(data);
		} catch (error) {
			console.log(error, "Error in fetch");
		}
	};


	useEffect(() => {
		if (apiData) {
			if (apiData.prompt && typeof apiData.prompt === "string") {
				setPrompt(apiData.prompt);
			}
		}
	}, [apiData]);

	useEffect(() => {
		const interval = setInterval(() => {
		  if(imageGeneratedTime) {
			const elapsed = (new Date().getTime() - imageGeneratedTime.getTime()) / 1000.0
			const progress = Math.min(1, elapsed / EXPIRATION_SECONDS);
			setExpirationProgress(progress)
			if(progress >= 1) {
				setGeneratedImageExpired(true)
			}
		  }		
		}, 200);
	
		return () => {
		  clearInterval(interval);
		};
	  }, [imageGeneratedTime]);
	

	return (
		<div className={styles.generatedImageContainer}>
			<div style={{position: 'fixed', left:0, top: 0}}>
			<ProgressBar width={window.innerWidth} height={20} progress={expirationProgress}></ProgressBar>
			</div>

			<div style={{width: '50%'}}>{prompt}</div>
			{imageSrc === '' && <div style={{width: '50%', fontSize: 'large', padding: '20px'}}>Generating AI interpretation...</div>}
			<img style={{width: '50%'}} src={imageSrc} alt="" />
		</div>
	);
};

export default ImageGenerator;
