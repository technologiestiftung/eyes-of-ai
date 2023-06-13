class MathUtils {
	static standardDeviation = (xs: Array<number>) => {
		const n = xs.length;
		const mean = xs.reduce((a, b) => a + b) / n;
		return Math.sqrt(
			xs.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
		);
	};
}

export default MathUtils;
