import alex from 'alex';
import { EmbedBuilder } from 'discord.js';

import { ExtendedClient } from '../interfaces/ExtendedClient';
import { errorHandler } from '../utils/errorHandler';
import { getAlexConfig } from '../utils/getAlexConfig';
import { AlexJsOptions } from '../config/AlexJsOptions';

export const checkContent = async (
  bot: ExtendedClient,
  content: string,
  serverId: string,
): Promise<EmbedBuilder[]> => {
  try {
    const config = await getAlexConfig(bot, serverId);
    const rawResult = alex.markdown(content, {
      ...AlexJsOptions.alexWhitelist,
      ...config.alexConfig,
    }).messages;
    let embeds: EmbedBuilder[] = [];

    let embed = new EmbedBuilder();
    embed.setTitle('Hold up!');
    embed.setDescription("That's bad");
    embed.setColor('#2B2D31');

    const uniqueMessages = new Set();

    for (const message of rawResult) {
      if (message.reason && !uniqueMessages.has(message.reason)) {
        uniqueMessages.add(message.reason);
        embed.addFields({
          name: message.reason,
          value: message.note || 'see above :)',
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
    await errorHandler(bot, error, 'alexjs check content');
    return [];
  }
};
