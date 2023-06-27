import { Result } from "@vladmandic/human";
import React, { useEffect, useState } from "react";
import useDump from "../hooks/useDump";
import { useEyesOfAIStore } from "../store";

interface Props {
	csrf: string;
}

const FaceDetectionPlayback: React.FC<Props> = ({ csrf }) => {
	const setPlaybackResult = useEyesOfAIStore(
		(state) => state.setPlaybackResult
	);
	const { loadDump } = useDump(csrf);
	const [dumpedResults, setDumpedResults] = useState<Array<Result>>();
	const [dumpIndex, setDumpIndex] = useState<number>(undefined);
	const humanDetected = useEyesOfAIStore((state) => state.humanDetected);
	const humanCloseEnough = useEyesOfAIStore((state) => state.humanCloseEnough);
	const [paused, setPaused] = useState(false);

	// Pause playback when human is detected and close enough
	useEffect(() => {
		if (humanDetected && humanCloseEnough) {
			console.log("human detected and close enough -> pausing playback");
			setPlaybackResult(undefined);
			setDumpIndex(undefined);
			setPaused(true);
		} else {
			console.log("restarting playback");
			setPaused(false);
		}
	}, [humanDetected, humanCloseEnough, setPlaybackResult]);

	// Set interval to iterate through the recorded results every x ms
	useEffect(() => {
		if (!dumpedResults || paused) return;
		const interval = setInterval(() => {
			setDumpIndex((di) =>
				di === undefined ? 0 : di < dumpedResults.length - 1 ? di + 1 : 0
			);
		}, 70);

		return () => {
			clearInterval(interval);
		};
	}, [dumpedResults, paused]);

	// Set the playback result so that HumanDetectionDisplay can use it
	useEffect(() => {
		if (dumpIndex && dumpedResults) {
			const dumpResult = dumpedResults[dumpIndex];
			setPlaybackResult(dumpResult);
		}
	}, [dumpIndex, dumpedResults, setPlaybackResult]);

	// Load playback dump
	useEffect(() => {
		(async () => {
			const dump = await loadDump();
			const parsed = JSON.parse(dump.dumpContent);
			setDumpedResults((_) => parsed);
		})();
	}, [loadDump]);

	return null;
};

export default FaceDetectionPlayback;
