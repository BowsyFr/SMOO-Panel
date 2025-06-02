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
    name: "game",
    description: "Gère la partie en cours",
    permission: "no",
    dm: true,
    options: [
        {
            type: "string",
            name: "option",
            description: "Choisissez l'option à utiliser",
            required: true,
            autocomplete: true
        },
        {
            type: "string",
            name: "pays",
            description: "Choisissez le monde où envoyer le joueur",
            required: true,
            autocomplete: true
        },
        {
            type: "string",
            name: "team",
            description: "Choisissez la team qui sera chasseur",
            required: true,
            autocomplete: true
        },
    ],

    async run(client, interaction) {
        const pays = interaction.options.getString("pays");
        const team = interaction.options.getString("team");
        const option = interaction.options.getString("option");

        if (option === "start") {
            const channelId = "1377370344628813866";
            const channel = await client.channels.fetch(channelId);

            if (!channel || !channel.isTextBased()) {
                return interaction.reply({ content: "Salon introuvable ou inaccessible.", ephemeral: true });
            }

            await interaction.reply({ content: `Lancement de la partie dans ${pays} avec l'équipe ${team}...`, ephemeral: true });

            // Étape 1 : Envoie dans le royaume choisi
            channel.send(`$sendall ${pays}`);

            // Étape 2 : 30s plus tard, envoie dans Odyssey
            setTimeout(() => {
                channel.send(`$send odyssey "" -1 ${team}`);
            }, 30000); // 30s

            // Étape 3 : 33s, stop le seeking
            setTimeout(() => {
                channel.send(`$tag seeking * false`);
            }, 33000); // 30s + 3s

            // Étape 4 : 34s, démarre le tag
            setTimeout(() => {
                channel.send(`$tag start 180 ${team}`);
                channel.send(`$tag time * 0 0`);
            }, 34000); // 30s + 4s

            // Étape 5 : 214s, remet le timer à 0
            setTimeout(() => {
                channel.send(`$tag time * 0 0`);
            }, 214000); // 34s + 180s
        } else {
            interaction.reply({ content: `Option inconnue : ${option}`, ephemeral: true });
        }
    }
}; 