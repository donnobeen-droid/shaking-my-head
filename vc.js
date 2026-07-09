import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

import { successEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { handleInteractionError } from '../../utils/errorHandler.js';

export default {
    data: new SlashCommandBuilder()
        .setName("vcstfu")
        .setDescription("Toggle a user's voice mute")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("The user to mute/unmute")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("Reason for the voice mute"),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

    category: "moderation",

    async execute(interaction) {
        try {
            const user = interaction.options.getUser("target");
            const reason =
                interaction.options.getString("reason") ||
                "No reason provided";

            const member = await interaction.guild.members.fetch(user.id);

            if (!member.voice.channel) {
                throw new Error("User is not in a voice channel.");
            }

            const newState = !member.voice.serverMute;

            await member.voice.setMute(
                newState,
                reason
            );

            await InteractionHelper.universalReply(interaction, {
                embeds: [
                    successEmbed(
                        newState
                            ? `🔇 **Muted** ${user.tag}`
                            : `🔊 **Unmuted** ${user.tag}`,
                        `**Reason:** ${reason}`,
                    ),
                ],
            });

        } catch (error) {
            logger.error("VC STFU command error:", error);

            await handleInteractionError(interaction, error, {
                subtype: "vcstfu_failed",
            });
        }
    },
};
