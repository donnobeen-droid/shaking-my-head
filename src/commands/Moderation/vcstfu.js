import { PermissionFlagsBits } from "discord.js";
import { successEmbed, errorEmbed } from "../../utils/embeds.js";
import { logger } from "../../utils/logger.js";

export default {
    name: "vc",
    description: "Voice chat moderation commands",
    category: "moderation",

    async execute(message, args) {
        try {
            if (!message.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
                return message.reply({
                    embeds: [
                        errorEmbed("❌ You don't have permission to mute members.")
                    ],
                });
            }

            const subcommand = args[0]?.toLowerCase();

            if (subcommand !== "stfu") {
                return message.reply("Usage: `-vc stfu @user`");
            }

            const target = message.mentions.members.first();

            if (!target) {
                return message.reply("❌ Mention a user to run this command.");
            }

            if (!target.voice.channel) {
                return message.reply("❌ That user is not in a voice channel.");
            }

            const isMuted = target.voice.serverMute;

            await target.voice.setMute(
                !isMuted,
                `VC STFU by ${message.author.tag}`
            );

            await message.reply({
                embeds: [
                    successEmbed(
                        !isMuted
                            ? `🔇 **VC STFU**\n${target.user.tag} has been muted.`
                            : `🔊 **VC STFU OFF**\n${target.user.tag} has been unmuted.`
                    ),
                ],
            });

        } catch (error) {
            logger.error("VC STFU command error:", error);

            await message.reply({
                embeds: [
                    errorEmbed("❌ Something went wrong while running VC STFU.")
                ],
            });
        }
    },
};
