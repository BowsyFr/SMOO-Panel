const Discord = require('discord.js');
const { ActivityType } = Discord;
const loadSlashCommands = require("../Loaders/loadSlashCommands");


module.exports = async client => {
    try {
        await loadSlashCommands(client);

        console.log(`SMOO Dashboard est en ligne ! ID: ${client.user.tag}`);

        // Notification initiale
        const channelId = '1377370323045060688';
        const channel = await client.channels.fetch(channelId).catch(console.error);
        if (channel) {
            await channel.send('Le Dashboard est ready 🚀 !');
            await channel.send('https://tenor.com/view/waddle-waddle-bitcoin-runes-pengu-waddle-waddle-pengu-gif-14234498873207878683');
        }

    } catch (error) {
        console.error('Erreur dans l\'événement ready:', error);
    }
};