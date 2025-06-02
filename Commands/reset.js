const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: "reset",
    description: "Remet les chronos à 0",
    permission: "no",
    dm: true,

    async run(client) {

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
            await targetChannel.send(`$tag time * 0 0`);
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
                await logChannel.send(`✅ Tous les chronomètres ont été remis à zéro.`);
            }
        } catch (err) {
            console.error("Erreur lors de l'envoi du message de confirmation :", err);
        }

    }
};