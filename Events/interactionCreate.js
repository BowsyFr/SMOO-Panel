const Discord = require('discord.js');

module.exports = async (client, interaction) => {
    if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        const command = require(`../Commands/${interaction.commandName}`);
        await command.run(client, interaction, command.options);
    }

    if (interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {
        const focusedOption = interaction.options.getFocused(true);

        // Autocomplétion pour "pays"
        if (focusedOption.name === "pays") {
            const kingdoms = [
                { name: "Cap Kingdom", value: "cap" },
                { name: "Cascade Kingdom", value: "cascade" },
                { name: "Sand Kingdom", value: "sand" },
                { name: "Lake Kingdom", value: "lake" },
                { name: "Wooded Kingdom", value: "wooded" },
                { name: "Cloud Kingdom", value: "cloud" },
                { name: "Lost Kingdom", value: "lost" },
                { name: "Metro Kingdom", value: "metro" },
                { name: "Snow Kingdom", value: "snow" },
                { name: "Seaside Kingdom", value: "sea" },
                { name: "Luncheon Kingdom", value: "lunch" },
                { name: "Ruined Kingdom", value: "ruined" },
                { name: "Bowser's Kingdom", value: "bowser" },
                { name: "Moon Kingdom", value: "moon" },
                { name: "Mushroom Kingdom", value: "mush" },
                { name: "Dark Side", value: "dark" },
                { name: "Darker Side", value: "darker" },
                { name: "Odyssey", value: "odyssey" }
            ];

            const filtered = kingdoms.filter(k =>
                k.name.toLowerCase().includes(focusedOption.value.toLowerCase()) ||
                k.value.toLowerCase().includes(focusedOption.value.toLowerCase())
            );

            await interaction.respond(filtered.slice(0, 25));
        }

        // Autocomplétion "joueur" avec extraction du nom avant (uuid)
        if (focusedOption.name === "joueur") {
            try {
                const channel = await client.channels.fetch('1377370344628813866');
                if (!channel || !channel.isTextBased()) return interaction.respond([]);

                await channel.send("$list");

                const filter = m => m.content.startsWith("List:");
                const collected = await channel.awaitMessages({ filter, max: 1, time: 5000, errors: ['time'] });

                const listMessage = collected.first();
                if (!listMessage) {
                    console.log("Aucun message List: reçu");
                    return interaction.respond([]);
                }

                console.log("Message List reçu :", listMessage.content);

                // Split en lignes et trim
                const lines = listMessage.content.split('\n').map(l => l.trim()).filter(l => l.length > 0);

                if(lines.length === 0) {
                    console.log("Message List vide ou mal formaté");
                    return interaction.respond([]);
                }

                const players = [];

                // Fonction utilitaire pour extraire le nom avant la parenthèse (uuid)
                const extractName = (line) => {
                    // Exemple : "Bowsy_ (d1d74952-c3e8-11e1-d96b-f42f63cc4697)" => "Bowsy_"
                    const match = line.match(/^(.+?)\s*\(/);
                    if(match) return match[1].trim();
                    // Pas de parenthèse = on prend tout
                    return line.trim();
                };

                // Extraire premier joueur après "List:"
                const firstLine = lines[0];
                const firstPlayerRaw = firstLine.slice(5).trim(); // supprime "List:"
                if(firstPlayerRaw.length > 0) {
                    const firstPlayerName = extractName(firstPlayerRaw);
                    players.push({ name: firstPlayerName, value: firstPlayerName });
                }

                // Extraire joueurs des lignes suivantes
                for(let i = 1; i < lines.length; i++) {
                    const playerName = extractName(lines[i]);
                    players.push({ name: playerName, value: playerName });
                }

                if(players.length === 0) console.log("Aucun joueur parsé, vérifier le format du message.");

                // Filtrer selon la saisie
                const filtered = players.filter(p =>
                    p.name.toLowerCase().includes(focusedOption.value.toLowerCase())
                ).slice(0, 25);

                await interaction.respond(filtered);

            } catch (error) {
                console.error("Erreur autocomplétion joueur:", error);
                await interaction.respond([]);
            }
        }

        // Autocomplétion "team"
        if (focusedOption.name === "team") {
            const teams = [
                { name: "Team Rouge", value: "Lucja Tresko Le_Bisounours Redz" },
                { name: "Team Jaune", value: "Bowsy_ Arka Mathis Saria" }
            ];

            const filtered = teams.filter(t =>
                t.name.toLowerCase().includes(focusedOption.value.toLowerCase()) ||
                t.value.toLowerCase().includes(focusedOption.value.toLowerCase())
            );

            await interaction.respond(filtered.slice(0, 25));
        }

        // Autocomplétion "option"
        if (focusedOption.name === "option") {
            const options = [
                { name: "Démarrer", value: "start" }
            ];

            const filtered = options.filter(o =>
                o.name.toLowerCase().includes(focusedOption.value.toLowerCase()) ||
                o.value.toLowerCase().includes(focusedOption.value.toLowerCase())
            );

            await interaction.respond(filtered.slice(0, 25));
        }
    }
};