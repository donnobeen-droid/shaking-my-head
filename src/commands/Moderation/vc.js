export default {
    name: "vc",

    async execute(message, args) {
        const subcommand = args[0];

        if (subcommand === "stfu") {
            if (!message.member.voice.channel) {
                return message.reply("You need to be in a voice channel.");
            }

            const members = message.member.voice.channel.members;

            for (const [, member] of members) {
                if (member.id !== message.author.id) {
                    member.voice.disconnect().catch(() => {});
                }
            }

            return message.reply("Disconnected everyone else from the voice channel.");
        }
    }
};
