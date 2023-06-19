export function calcRatio(
	inWidth: number,
	inHeight: number,
	maxWidth: number,
	maxHeight: number
) {
	let width = inWidth;
	let height = inHeight;
	const aspectRatio = width / height;
	if (width > maxWidth) {
		width = maxWidth;
		height = width / aspectRatio;
	}
	if (height > maxHeight) {
		height = maxHeight;
		width = height * aspectRatio;
	}
	return { width, height };
}
