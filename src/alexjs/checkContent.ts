import alex from "alex";
import { EmbedBuilder } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";
import { getAlexConfig } from "../utils/getAlexConfig";

interface AlexConfig {
	allow: Array<string>;
	profanitySureness: 0 | 1 | 2;
	noBinary: boolean;
}

export const checkContent = async (
	bot: ExtendedClient,
	content: string,
	serverId: string
): Promise<EmbedBuilder[]> => {
	try {
		const config = await getAlexConfig(bot, serverId);
		const { allow, profanitySureness, noBinary } =
			config.alexConfig as AlexConfig;
		const rawResult = alex.markdown(content, {
			allow,
			profanitySureness,
			noBinary,
		}).messages;
		let embeds: EmbedBuilder[] = [];

		let embed = new EmbedBuilder();
		embed.setTitle("Hold up!");
		embed.setDescription("That's bad");
		embed.setColor("#2B2D31");

		const uniqueMessages = new Set();

		for (const message of rawResult) {
			if (
				message.actual &&
				!uniqueMessages.has((message.actual as string).toLowerCase())
			) {
				uniqueMessages.add((message.actual as string).toLowerCase());
				let response;
				if (!message.note) {
					response = "see above.";
				} else {
					response = message.note;
				}
				embed.addFields({
					name: message.reason,
					value: response,
				});
			}
		}

		if (!rawResult.length) {
			embeds = [];
		} else {
			embeds.push(embed);
		}

		return embeds;
	} catch (error) {
		await errorHandler(bot, error, "alexjs check content");
		return [];
	}
};
