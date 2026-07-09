import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("vc")
        .setDescription("Voice channel commands")
        .addSubcommand(sub =>
            sub
                .setName("stfu")
                .setDescription("Disconnect everyone else from your voice channel")
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "stfu") {
            const channel = interaction.member.voice.channel;

            if (!channel) {
                return interaction.reply({
                    content: "You need to be in a voice channel.",
                    ephemeral: true
                });
            }

            for (const [, member] of channel.members) {
                if (member.id !== interaction.user.id) {
                    await member.voice.disconnect().catch(() => {});
                }
            }

            return interaction.reply(
                "Disconnected everyone else from the voice channel."
            );
        }
    },

    async prefixExecute(message, args) {
        const subcommand = args[0];

        if (subcommand === "stfu") {
            const channel = message.member.voice.channel;

            if (!channel) {
                return message.reply("You need to be in a voice channel.");
            }

            for (const [, member] of channel.members) {
                if (member.id !== message.author.id) {
                    await member.voice.disconnect().catch(() => {});
                }
            }

            return message.reply(
                "Disconnected everyone else from the voice channel."
            );
        }
    }
};
