import { useCallback, useState } from "react";
import { LocalizedPrompt } from "../pages/api/prompt";
import { ColorthiefResponse } from "../lib/types";
import { Result } from "@vladmandic/human";

const useGeneratedImage = (csrf: string) => {
	const [isLoading, setIsLoading] = useState(true);

	const generateImage = useCallback(
		async ({
			localizedPrompt,
			colors,
			result,
		}: {
			localizedPrompt: LocalizedPrompt;
			colors: ColorthiefResponse;
			result: Partial<Result>;
		}) => {
			setIsLoading(true);
			const response = await fetch("/api/images", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-Token": csrf,
				},
				body: JSON.stringify({ ...localizedPrompt, colors, result }),
			});
			if (!response.ok) {
				const txt = await response.json();
				throw new Error(txt);
			}
			const data = await response.json();
			if (data.data?.url) {
				return data.data.url;
			} else {
				throw new Error("Generated image source not found");
			}
		},
		[csrf]
	);

	return { generateImage, isLoading };
};

export default useGeneratedImage;
