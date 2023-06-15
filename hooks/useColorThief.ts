import { useCallback, useState } from "react";
import { ColorthiefResponse } from "../lib/types";

const useColorThief = () => {
	const [isLoading, setIsLoading] = useState(true);

	const getColors = useCallback(
		async (
			dataUrl: string,
			callback: (colors: ColorthiefResponse) => void,
			errorCallback: (error: Error) => void
		) => {
			try {
				setIsLoading(true);
				const response = await fetch(process.env.NEXT_PUBLIC_COLORTHIEF_URL, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ dataUrl }),
				});

				setIsLoading(false);
				if (!response.ok) {
					const txt = await response.json();
					throw new Error(txt);
				}
				const colors = (await response.json()) as ColorthiefResponse;
				callback(colors);
			} catch (e) {
				errorCallback(e);
			}
		},
		[]
	);
	return { getColors, isLoading };
};

export default useColorThief;
