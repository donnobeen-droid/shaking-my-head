export default {
    data: {
        name: "vcgodmode",
        description: "Automatically unmute a user if they get muted"
    },

    async execute(message, args) {
        if (!message.member.permissions.has("Administrator")) {
            return message.reply("You need Administrator permissions.");
        }

        const target = message.mentions.members.first();

        if (!target) {
            return message.reply("Usage: `-vc godmode @user`");
        }

        // Store the protected user's ID
        if (!global.vcGodmodeUsers) {
            global.vcGodmodeUsers = new Set();
        }

        global.vcGodmodeUsers.add(target.id);

        return message.reply(
            `✅ ${target.user.tag} is now in VC godmode. If they get muted, I will unmute them.`
        );
    }
};
