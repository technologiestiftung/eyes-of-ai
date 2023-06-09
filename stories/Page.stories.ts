import type { Meta, StoryObj } from "@storybook/react";

import Page from "../pages/index";

const meta: Meta<typeof Page> = {
	title: "Root",
	component: Page,
	args: {
		// More on args: https://storybook.js.org/docs/react/writing-stories/args
		csrf: "csrf",
	},
	parameters: {
		// More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof Page>;

export const Default: Story = {};
