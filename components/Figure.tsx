/* eslint-disable @next/next/no-img-element */
import React from "react";
interface Props {
	src: string;
	alt: string;
	caption?: string;
	showCaption?: boolean;
}

const Figure: React.FC<Props> = ({ src, alt, caption, showCaption }) => {
	return (
		<>
			<figure className="flex flex-col items-center pt-2 ">
				<img
					src={src}
					alt={alt}
					className="h-512px w-512px"
					width={512}
					height={512}
				/>
				{showCaption && (
					<figcaption className="pt-3 text-lg leading-snug text-left">
						{caption}
					</figcaption>
				)}
			</figure>
		</>
	);
};

export default Figure;
