const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: "list",
    description: "Donne la liste des joueurs",
    permission: "no",
    dm: false, // Si false, la commande ne fonctionne que dans un serveur

    async run(client, interaction) { // Ajout de `interaction` en paramètre
        const commandChannelId = "1377370344628813866";
        const logChannelId = "1377381895246970880";

        try {
            // 1. Envoi de "$list" dans le salon cible
            const commandChannel = await client.channels.fetch(commandChannelId);
            if (!commandChannel || !commandChannel.isTextBased()) {
                return interaction.reply({
                    content: "❌ Salon de commande invalide.",
                    ephemeral: true
                });
            }

            await commandChannel.send("$list");

            // 2. Récupération du dernier message après un délai
            setTimeout(async () => {
                const messages = await commandChannel.messages.fetch({ limit: 1 });
                const lastMessage = messages.first();

                if (lastMessage && lastMessage.author.bot) { // Vérifie si c'est un message du bot
                    const logChannel = await client.channels.fetch(logChannelId);
                    if (logChannel?.isTextBased()) {
                        await logChannel.send(`📋 **Résultat du /list :**\n\`\`\`${lastMessage.content}\`\`\``);
                    }
                }
            }, 1500); // Délai ajustable (1.5 secondes)


        } catch (error) {
            console.error("Erreur dans /list :", error);
            await interaction.reply({
                content: "❌ Une erreur est survenue.",
                ephemeral: true
            });
        }
    }
};