import { useEffect, useState } from "react";
import { useEyesOfAIStore } from "../store";
import { Emotion, FaceGesture, IrisGesture, Result } from "@vladmandic/human";
import { Body } from "./api/prompt";

const ApiExplorer: React.FC<{ csrf: string }> = ({ csrf }) => {
	const result = useEyesOfAIStore((state) => state.result);

	useEffect(() => {
		if (result) {
			console.log("result:", result);
		}
	}, [result]);

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

	const [prompt, setPrompt] = useState<string>("");

	const [apiData, setApiData] = useState<Record<string, unknown> | null>(null);
	const [imageSrc, setImageSrc] = useState<string>("");

	useEffect(() => {
		if (apiData) {
			if (apiData.prompt && typeof apiData.prompt === "string") {
				setPrompt(apiData.prompt);
			}
		}
	}, [apiData]);

	return (
		<div className="flex flex-col items-center justify-center h-screen mx-auto my-0">
			<h1 className="text-xl font-black">Api Explorer</h1>
			<div className="flex flex-col self-center w-screen">
				<form id="prompt">
					<div className="flex flex-row items-center w-full p-2">
						<label htmlFor="prompt" className="pr-2">
							Prompt:
						</label>
						<input
							id="prompt"
							type="text"
							className="w-full p-2 m-2 border border-cyan-600"
							value={prompt}
							onChange={(e) => {
								setPrompt(e.target.value);
							}}
						/>
					</div>
					<div className="flex flex-row justify-between p-2">
						<button
							id="get-prompt"
							type="button"
							onClick={(e) => {
								e.preventDefault();

								createPrompt().catch((err) => {
									console.log(err);
								});
							}}
							className="w-32 p-2 m-2 text-white bg-black rounded-md hover:bg-gray-500"
						>
							Get Prompt
						</button>
						<button
							id="get-image"
							type="button"
							onClick={(e) => {
								console.log("clicked get image");
								e.preventDefault();
								createImage().catch((err) => {
									console.log(err);
								});
							}}
							className="w-32 p-2 m-2 text-white bg-black rounded-md m-2text-white hover:bg-gray-500"
						>
							Get Image
						</button>
					</div>
				</form>
			</div>
			<div className="flex flex-col self-center w-screen">
				<pre className="p-5 whitespace-pre-wrap">
					<code>{JSON.stringify(apiData, null, 2)}</code>
				</pre>
			</div>
			<div className="flex flex-col self-center w-screen p-5">
				{imageSrc && (
					<figure className="flex flex-col self-center w-screen p-5">
						<img src={imageSrc} alt={prompt} className="max-w-sm" />
						<figcaption>{prompt}</figcaption>
					</figure>
				)}
			</div>
		</div>
	);
};

export default ApiExplorer;
