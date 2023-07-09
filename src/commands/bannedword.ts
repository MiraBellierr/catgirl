import {
	CommandInteraction,
	SlashCommandBuilder,
	SlashCommandStringOption,
	SlashCommandSubcommandBuilder,
} from "discord.js";
import { Command } from "../interfaces/Command";

const addSubCommand = () => {
	return new SlashCommandSubcommandBuilder()
		.setName("add")
		.setDescription("add word to the banned list")
		.addStringOption(
			new SlashCommandStringOption()
				.setName("word")
				.setDescription("word you want to add")
				.setRequired(true)
		);
};

const deleteSubCommand = () => {
	return new SlashCommandSubcommandBuilder()
		.setName("delete")
		.setDescription("delete word from the banned list")
		.addStringOption(
			new SlashCommandStringOption()
				.setName("word")
				.setDescription("banned word")
				.setRequired(true)
		);
};

export const bannedword: Command = {
	data: new SlashCommandBuilder()
		.setName("bannedword")
		.setDescription("edit list of the banned words")
		.addSubcommand(addSubCommand)
		.addSubcommand(deleteSubCommand),
	run: async (bot, interaction) => {
		if (interaction.options.getSubcommand() === "add") {
			interaction.reply(
				await addWord(bot, interaction, interaction.options.getString("word")!)
			);
		} else {
			interaction.reply(
				await deleteWord(
					bot,
					interaction,
					interaction.options.getString("word")!
				)
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

	const words = guildQuery?.bannedWordConfig as Array<string>;

	const index = words!.indexOf(wordToDelete);
	if (index !== -1) {
		const updated = await ServerConfig.findOneAndUpdate(
			{
				serverId: interaction.guildId,
			},
			{
				$pull: { bannedWordConfig: wordToDelete },
			},
			{ new: true }
		);

		const cache = bot.cache[interaction.guildId as string];
		bot.cache[interaction.guildId as string] = {
			alexConfig: cache.alexConfig,
			bannedWordConfig: updated!.bannedWordConfig!,
		};

		return `Successfully deleted the word "${wordToDelete}" from the banned list.`;
	} else {
		return `The word "${wordToDelete}" does not exist in the banned list.`;
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

	const words = guildQuery?.bannedWordConfig as Array<string>;

	if (!words!.includes(wordToAdd)) {
		const updated = await ServerConfig.findOneAndUpdate(
			{
				serverId: interaction.guildId!,
			},
			{
				$push: { bannedWordConfig: wordToAdd },
			},
			{ new: true }
		);

		const cache = bot.cache[interaction.guildId as string];
		bot.cache[interaction.guildId as string] = {
			alexConfig: cache.alexConfig,
			bannedWordConfig: updated!.bannedWordConfig!,
		};

		return `Successfully added the word "${wordToAdd}" to the banned list.`;
	} else {
		return `The word "${wordToAdd}" already exists in the banned list.`;
	}
}
