import ServerConfig from "../database/models/ServerConfig";
import { ExtendedClient } from "../interfaces/ExtendedClient";

interface AlexConfig {
	allow: Array<string>;
	profanitySureness: 0 | 1 | 2;
	noBinary: boolean;
}

export const getAlexConfig = async (bot: ExtendedClient, serverId: string) => {
	if (bot.cache[serverId]) {
		return bot.cache[serverId];
	}

	const config = await ServerConfig.findOne({ serverId });

	if (config) {
		bot.cache[serverId] = {
			alexConfig: config.alexConfig as AlexConfig,
			bannedWordConfig: config.bannedWordConfig!,
		};
		return { alexConfig: config.alexConfig };
	}

	const newConfig = await ServerConfig.create({
		serverId,
		alexConfig: {
			profanitySureness: 1,
			noBinary: false,
			allow: [],
		},
		bannedWordConfig: [],
	});

	bot.cache[serverId] = {
		alexConfig: newConfig.alexConfig as AlexConfig,
		bannedWordConfig: newConfig.bannedWordConfig!,
	};
	return { alexConfig: newConfig.alexConfig };
};
