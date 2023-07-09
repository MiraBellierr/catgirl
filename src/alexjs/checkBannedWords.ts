import { EmbedBuilder } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";
import { getBannedWordConfig } from "../utils/getBannedWordConfig";

export const checkBannedWords = async (
	bot: ExtendedClient,
	content: string,
	serverId: string
): Promise<EmbedBuilder[]> => {
	let embeds: EmbedBuilder[] = [];
	try {
		const config = await getBannedWordConfig(bot, serverId);
		const checkWords = config.bannedWordConfig as Array<string>;
		let badword = false;

		if (checkWords && checkWords!.length > 0) {
			const uniqueMessages = new Set();

			const embed = new EmbedBuilder();
			embed.setTitle("Hold up!");
			embed.setColor("#2B2D31");
			embed.setDescription("That's bad");

			content.split(" ").forEach((word) => {
				if (word && !uniqueMessages.has(word.toLowerCase())) {
					if (checkWords!.includes(word.toLowerCase())) {
						uniqueMessages.add(word.toLowerCase());
						badword = true;

						embed.addFields({
							name: `Don't use it, \`${word}\` is offensive.`,
							value: "see above ^",
						});
					}
				}
			});

			embeds.push(embed);
		}

		if (!badword) embeds = [];

		return embeds;
	} catch (error) {
		await errorHandler(bot, error, "alexjs check content");
		return [];
	}
};
