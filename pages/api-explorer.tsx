import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";

export const getServerSideProps: GetServerSideProps = async (context) => {
	// const csrfToken = cookies.get("csrf") ?? "";
	// const csrfToken = await createToken();

	const token = context.res.req.headers["x-csrf-token"] as string;
	const cookies = new Cookies();
	cookies.set("edge-csrf", token);
	return { props: { csrf: token } };
};
const ApiExplorer: React.FC<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ csrf }) => {
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
					csrf_token: csrf,
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
		const randomGenderPercentage = Math.floor(Math.random() * 100);
		try {
			const response = await fetch("/api/prompt", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-Token": csrf,
				},
				body: JSON.stringify({
					age: Math.floor(Math.random() * 100),
					gender: {
						male: randomGenderPercentage,
						female: 100 - randomGenderPercentage,
					},
				}),
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
		<main className="flex flex-col items-center justify-center h-screen mx-auto my-0">
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
		</main>
	);
};

export default ApiExplorer;
