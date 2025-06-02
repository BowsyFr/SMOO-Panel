const { SlashCommandBuilder } = require('discord.js');

const VALID_KINGDOMS = {
    cap: "Cap Kingdom",
    cascade: "Cascade Kingdom",
    sand: "Sand Kingdom",
    lake: "Lake Kingdom",
    wooded: "Wooded Kingdom",
    cloud: "Cloud Kingdom",
    lost: "Lost Kingdom",
    metro: "Metro Kingdom",
    snow: "Snow Kingdom",
    sea: "Seaside Kingdom",
    lunch: "Luncheon Kingdom",
    ruined: "Ruined Kingdom",
    bowser: "Bowser's Kingdom",
    moon: "Moon Kingdom",
    mush: "Mushroom Kingdom",
    dark: "Dark Side",
    darker: "Darker Side",
    odyssey: "Odyssey"
};

module.exports = {
    name: "sendall",
    description: "Envoie tous les joueurs dans un autre pays",
    permission: "no",
    dm: true,
    options: [
        {
            type: "string",
            name: "pays",
            description: "Choisissez le monde où envoyer tous les joueurs",
            required: true,
            autocomplete: true
        },
    ],

    async run(client, interaction) {
        const pays = interaction.options.getString("pays");

        // Vérifie si le code de pays est valide
        if (!VALID_KINGDOMS[pays]) {
            return interaction.reply({
                content: `❌ Le code de monde \`${pays}\` est invalide.`,
                ephemeral: true
            });
        }

        let targetChannel;
        try {
            targetChannel = await client.channels.fetch("1377370344628813866");
        } catch (error) {
            console.error("Erreur lors de la récupération du salon de commande :", error);
            return interaction.reply({
                content: "Impossible de trouver le salon de commande.",
                ephemeral: true
            });
        }

        if (!targetChannel || !targetChannel.isTextBased()) {
            return interaction.reply({
                content: "Le salon de commande n'est pas textuel.",
                ephemeral: true
            });
        }

        try {
            await targetChannel.send(`$sendall ${pays}`);
        } catch (err) {
            console.error("Erreur lors de l'envoi du message :", err);
            return interaction.reply({
                content: "Une erreur est survenue lors de l'envoi de la commande.",
                ephemeral: true
            });
        }

        // Envoi dans le salon de confirmation
        try {
            const logChannel = await client.channels.fetch("1377381895246970880");
            if (logChannel && logChannel.isTextBased()) {
                await logChannel.send(`✅ Tous les joueurs ont été envoyés à **${VALID_KINGDOMS[pays]}**.`);
            }
        } catch (err) {
            console.error("Erreur lors de l'envoi du message de confirmation :", err);
        }
    }
};