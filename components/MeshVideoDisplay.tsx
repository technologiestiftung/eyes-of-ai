/* eslint-disable @next/next/no-img-element */
import { LocalizedPrompt } from "../pages/api/prompt";
import Loading from "./Loading";
import UserHintBox from "./UserHintBox";

const MeshVideoDisplay: React.FC<{}> = ({}) => {
	return (
		<div
			className="w-full h-full flex flex-col gap-10"
			style={{ padding: "40px" }}
		>
			<div className="h-[20%]">
				<div
					className={`flex items-center justify-center  text-center text-2xl`}
				>
					<UserHintBox label={"durch die augen der ki"}></UserHintBox>
				</div>
			</div>
			<div>
				<video
					className="w-full h-auto"
					src={"videos/loop.mp4"}
					autoPlay={true}
					loop={true}
					style={{ outline: "none", width: "100%", height: "auto" }}
				/>
			</div>
		</div>
	);
};

export default MeshVideoDisplay;
