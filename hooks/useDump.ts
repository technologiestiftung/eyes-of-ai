import { useCallback, useState } from "react";

const useDump = (csrf: string) => {
	const [isLoading, setIsLoading] = useState(true);

	const loadDump = useCallback(async () => {
		setIsLoading(true);
		const response = await fetch("/api/dump", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-Token": csrf,
			},
		});
		if (!response.ok) {
			const txt = await response.json();
			throw new Error(txt);
		}
		const data = await response.json();
		return data;
	}, [csrf]);

	return { loadDump, isLoading };
};

export default useDump;
