import { useCallback, useState } from "react";
import { LocalizedPrompt } from "../pages/api/prompt";

const useGeneratedImage = (csrf: string) => {
	const [isLoading, setIsLoading] = useState(true);

	const generateImage = useCallback(
		async (
			localizedPrompt: LocalizedPrompt,
			callback: (prompt: string) => void
		) => {
			setIsLoading(true);
			try {
				const response = await fetch("/api/images", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-CSRF-Token": csrf,
					},
					body: JSON.stringify(localizedPrompt),
				});
				if (!response.ok) {
					const txt = await response.json();
					throw new Error(txt);
				}
				const data = await response.json();
				if (data.data?.url) {
					callback(data.data.url);
				} else {
					throw new Error("Generated image source not found");
				}
			} catch (error) {
				console.log(error, "Error in fetch");
			}
		},
		[csrf]
	);

	return { generateImage, isLoading };
};

export default useGeneratedImage;
