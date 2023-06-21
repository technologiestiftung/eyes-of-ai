import React from "react";

interface Props {
	label: string;
}

const UserHintBox: React.FC<Props> = ({ label }) => {
	return (
		<>
			<div className="grid h-screen place-items-center text-3xl font-bold w-full h-[20%]">
				{label}
			</div>
		</>
	);
};

export default UserHintBox;
