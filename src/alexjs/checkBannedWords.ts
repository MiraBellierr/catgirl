import { EmbedBuilder } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";
import { getBannedWordConfig } from "../utils/getBannedWordConfig";

export const checkBannedWords = async (
	bot: ExtendedClient,
	content: string,
	serverId: string
): Promise<EmbedBuilder[]> => {
	const embeds: EmbedBuilder[] = [];
	try {
		const config = await getBannedWordConfig(bot, serverId);
		const checkWords = config.bannedWordConfig as Array<string>;

		const embed = new EmbedBuilder();
		embed.setTitle("Hold up!");
		embed.setColor("#2B2D31");
		embed.setDescription("That's bad");
		embeds.push(embed);

		const uniqueMessages = new Set();

		if (checkWords && checkWords!.length > 0) {
			content.split(" ").forEach((word) => {
				if (word && !uniqueMessages.has(word.toLowerCase())) {
					if (checkWords!.includes(word.toLowerCase())) {
						uniqueMessages.add(word.toLowerCase());
						embed.addFields({
							name: `Don't use it, \`${word}\` is offensive.`,
							value: "see above ^",
						});
					}
				}
			});
		}

		return embeds;
	} catch (error) {
		await errorHandler(bot, error, "alexjs check content");
		return [];
	}
};
