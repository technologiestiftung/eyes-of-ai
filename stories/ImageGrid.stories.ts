import type { Meta, StoryObj } from "@storybook/react";

// import { Button } from './Button';
import ImageGrid from "../components/ImageGrid";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof ImageGrid> = {
	title: "ImageGrid",
	component: ImageGrid,
	tags: ["autodocs"],
	argTypes: {
		showCaption: { type: "boolean" },
		showMoreButton: { type: "boolean" },
	},
	parameters: {
		// More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof ImageGrid>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const NoCaption: Story = {
	args: {
		showCaption: false,
		showMoreButton: true,
	},
};
