import { Result } from "@vladmandic/human";
import { useCallback, useState } from "react";
import { ColorthiefResponse } from "../lib/types";
import { Body, LocalizedPrompt } from "../pages/api/prompt";

const usePrompt = (csrf: string, result: Partial<Result>) => {
	const [isLoading, setIsLoading] = useState(true);

	const generatePrompt = useCallback(
		async (
			colors: ColorthiefResponse,
			callback: (localizedPrompt: LocalizedPrompt) => void,
			errorCallback: (error: Error) => void
		) => {
			try {
				setIsLoading(true);

				const gestures = result.gesture.map((item) => item.gesture);
				const emotions = result.face[0].emotion
					.map((e) => e.emotion)
					.slice(0, 2);
				const age = result.face[0].age;

				const gender =
					result.face[0].gender === "unknown" ||
					result.face[0].genderScore < 0.4
						? "non-binary"
						: result.face[0].gender;

				const body: Body = {
					age,
					gender,
					emotions,
					gestures,
					colors,
				};

				const response = await fetch("/api/prompt", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-CSRF-Token": csrf,
					},
					body: JSON.stringify(body),
				});

				setIsLoading(false);

				if (!response.ok) {
					const txt = await response.json();
					throw new Error(txt);
				}

				const { localizedPrompt } = await response.json();

				callback(localizedPrompt);
			} catch (e) {
				errorCallback(e);
			}
		},
		[csrf, result]
	);

	return { generatePrompt, isLoading };
};

export default usePrompt;
