import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import fs from "fs";
import path from "path";
import { successEmbed, errorEmbed } from "../../utils/embeds.js";

const filePath = path.resolve("src/data/vcGodmode.json");

function getData() {
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, JSON.stringify([]));
    }

    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function saveData(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export default {
    data: new SlashCommandBuilder()
        .setName("vcgodmode")
        .setDescription("Toggle VC Godmode (auto remove server mute)")
        .addSubcommand(sub =>
            sub
                .setName("enable")
                .setDescription("Enable VC Godmode")
        )
        .addSubcommand(sub =>
            sub
                .setName("disable")
                .setDescription("Disable VC Godmode")
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    category: "moderation",

    async execute(interaction) {
        const userId = interaction.user.id;
        const action = interaction.options.getSubcommand();

        let users = getData();

        if (action === "enable") {
            if (!users.includes(userId)) {
                users.push(userId);
                saveData(users);
            }

            return interaction.reply({
                embeds: [
                    successEmbed(
                        "🛡️ VC Godmode Enabled",
                        "You will automatically be un-server-muted when possible."
                    )
                ],
                ephemeral: true
            });
        }

        if (action === "disable") {
            users = users.filter(id => id !== userId);
            saveData(users);

            return interaction.reply({
                embeds: [
                    successEmbed(
                        "🛡️ VC Godmode Disabled",
                        "Your protection has been removed."
                    )
                ],
                ephemeral: true
            });
        }
    }
};
