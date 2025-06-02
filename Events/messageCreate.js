const Discord = require('discord.js');

module.exports = async (client, message) => {
    // Vérifie si le message est dans le bon salon et provient du bon utilisateur
    if (message.channel.id === '1377370323045060688' && message.author.id === '1377369012597555241') {
        try {
            const targetChannel = await client.channels.fetch('1377381895246970880').catch(console.error);

            if (targetChannel) {
                // Envoie le contenu du message dans le salon cible
                await targetChannel.send(`${message.content}`);

                // Si le message a des pièces jointes, on les renvoie aussi
                if (message.attachments.size > 0) {
                    await targetChannel.send({
                        files: [...message.attachments.values()].map(attachment => attachment.url)
                    });
                }
            }
        } catch (error) {
            console.error('Erreur lors du transfert du message :', error);
        }
    }
};