import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { ExtendedClient } from "./ExtendedClient";

export interface Command {
	data:
		| SlashCommandBuilder
		| SlashCommandSubcommandBuilder
		| SlashCommandSubcommandsOnlyBuilder;
	run: (
		bot: ExtendedClient,
		interaction: ChatInputCommandInteraction
	) => Promise<void>;
}
