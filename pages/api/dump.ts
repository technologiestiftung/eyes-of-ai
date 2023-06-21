import { promises as fs } from "fs";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const fileContents = await fs.readFile(
		process.cwd() + "/public/dumps/dump_new.json",
		"utf8"
	);
	res.status(200).json({ dumpContent: fileContents });
};

export default handler;
