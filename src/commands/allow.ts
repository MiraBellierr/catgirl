import {
	CommandInteraction,
	SlashCommandBuilder,
	SlashCommandStringOption,
	SlashCommandSubcommandBuilder,
} from "discord.js";
import { Command } from "../interfaces/Command";

interface AlexConfig {
	allow: Array<string>;
	profanitySureness: 0 | 1 | 2;
	noBinary: boolean;
}

const addSubCommand = () => {
	return new SlashCommandSubcommandBuilder()
		.setName("add")
		.setDescription("add group id to the allow list")
		.addStringOption(
			new SlashCommandStringOption()
				.setName("id")
				.setDescription("Id of the word group")
				.setRequired(true)
		);
};

const deleteSubCommand = () => {
	return new SlashCommandSubcommandBuilder()
		.setName("delete")
		.setDescription("delete group id from the allow list")
		.addStringOption(
			new SlashCommandStringOption()
				.setName("id")
				.setDescription("Id of the word group")
				.setRequired(true)
		);
};

export const allow: Command = {
	data: new SlashCommandBuilder()
		.setName("allow")
		.setDescription("allow certain group of words")
		.addSubcommand(addSubCommand)
		.addSubcommand(deleteSubCommand),
	run: async (bot, interaction) => {
		if (interaction.options.getSubcommand() === "add") {
			interaction.reply(
				await addWord(bot, interaction, interaction.options.getString("id")!)
			);
		} else {
			interaction.reply(
				await deleteWord(bot, interaction, interaction.options.getString("id")!)
			);
		}
	},
};

import ServerConfig from "../database/models/ServerConfig";
import { ExtendedClient } from "../interfaces/ExtendedClient";

async function deleteWord(
	bot: ExtendedClient,
	interaction: CommandInteraction,
	wordToDelete: string
) {
	const guildQuery = await ServerConfig.findOne({
		serverId: interaction.guildId,
	});

	const words = guildQuery?.alexConfig?.allow;

	const index = words!.indexOf(wordToDelete);
	if (index !== -1) {
		const updated = await ServerConfig.findOneAndUpdate(
			{
				serverId: interaction.guildId,
			},
			{
				$pull: { "alexConfig.allow": wordToDelete },
			},
			{ new: true }
		);

		const cache = bot.cache[interaction.guildId as string];
		bot.cache[interaction.guildId as string] = {
			alexConfig: updated!.alexConfig as AlexConfig,
			bannedWordConfig: cache.bannedWordConfig!,
		};

		return `Successfully deleted the word "${wordToDelete}" from the allow list.`;
	} else {
		return `The word "${wordToDelete}" does not exist in the allow list.`;
	}
}

async function addWord(
	bot: ExtendedClient,
	interaction: CommandInteraction,
	wordToAdd: string
) {
	const guildQuery = await ServerConfig.findOne({
		serverId: interaction.guildId!,
	});

	const words = guildQuery?.alexConfig?.allow;

	if (!words!.includes(wordToAdd)) {
		const updated = await ServerConfig.findOneAndUpdate(
			{
				serverId: interaction.guildId!,
			},
			{
				$push: { "alexConfig.allow": wordToAdd },
			},
			{ new: true }
		);

		const cache = bot.cache[interaction.guildId as string];
		bot.cache[interaction.guildId as string] = {
			alexConfig: updated!.alexConfig as AlexConfig,
			bannedWordConfig: cache.bannedWordConfig!,
		};

		return `Successfully added the word "${wordToAdd}" to the allow list.`;
	} else {
		return `The word "${wordToAdd}" already exists in the allow list.`;
	}
}
