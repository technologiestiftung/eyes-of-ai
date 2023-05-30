import * as React from "react";

export default function Header() {
	return (
		<div className="flex flex-col items-center justify-center pt-10 text-center sm:gap-5">
			<h1 className="pt-2 text-5xl font-semibold">Through the eyes of AI</h1>
			<p className="text-center text-mdfont-mediumtext-xl">
				Hier findest du alle Informationen zu unserem Projekt.
			</p>
		</div>
	);
}
