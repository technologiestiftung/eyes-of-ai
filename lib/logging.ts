const dom: {
	log: HTMLDivElement | undefined;
	status: HTMLDivElement | undefined;
	perf: HTMLDivElement | undefined;
} = { log: undefined, status: undefined, perf: undefined };

export const log = (...msg: any) => {
	if (typeof document !== "undefined") {
		if (!dom.log) dom.log = document.getElementById("log") as HTMLDivElement;
		dom.log.innerText += msg.join(" ") + "\n";
	}
	console.log(...msg);
};
