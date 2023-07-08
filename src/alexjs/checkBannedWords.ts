import { EmbedBuilder } from 'discord.js';

import { ExtendedClient } from '../interfaces/ExtendedClient';
import { errorHandler } from '../utils/errorHandler';
import { BannedWordsOptions } from '../config/BannedWordsOptions';
import { getBannedWordConfig } from '../utils/getBannedWordConfig';

export const checkBannedWords = async (
  bot: ExtendedClient,
  content: string,
  serverId: string,
): Promise<EmbedBuilder[]> => {
  const embeds: EmbedBuilder[] = [];
  try {
    const config = await getBannedWordConfig(bot, serverId);
    const checkWords = config.bannedWordConfig
      ? config.bannedWordConfig
      : BannedWordsOptions;
    content.split(' ').forEach((word) => {
      if (checkWords.includes(word.toLowerCase())) {
        const embed = new EmbedBuilder();
        embed.setTitle('Hold up!');
        embed.setColor('#2B2D31');
        embed.setDescription("That's bad");
        embeds.push(embed);
      }
    });

    return embeds;
  } catch (error) {
    await errorHandler(bot, error, 'alexjs check content');
    return [];
  }
};
