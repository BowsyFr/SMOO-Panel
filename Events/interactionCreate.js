const Discord = require('discord.js');

module.exports = async (client, interaction) => {
    if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        const command = require(`../Commands/${interaction.commandName}`);
        await command.run(client, interaction, command.options);
    }

    if (interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {
        const focusedOption = interaction.options.getFocused(true); // Récupère l'option en cours de saisie

        // Autocomplétion pour l'argument "pays"
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

        // Autocomplétion pour l'argument "joueur"
        if (focusedOption.name === "joueur") {
            const players = [
                { name: "Bowsy", value: "Bowsy_" }, // ✅
                { name: "Lucja Fell", value: "Lucja" },
                { name: "Arkanyx", value: "Arka" }, // ✅
                { name: "Bisounours", value: "Bisounours" },
                { name: "Tresko", value: "Tresko" },
                { name: "Sariapika", value: "Saria" }, // ✅
                { name: "Redz", value: "Redz_" }, // ✅
                { name: "Mathis Quest", value: "mathis" }, // ✅
                { name: "Team Rouge", value: "Lucja Tresko Bisounours Redz_" },
                { name: "Team Jaune", value: "Bowsy_ Arka mathis Saria" } // ✅
            ];

            const filtered = players.filter(p =>
                p.name.toLowerCase().includes(focusedOption.value.toLowerCase()) ||
                p.value.toLowerCase().includes(focusedOption.value.toLowerCase())
            );

            await interaction.respond(filtered.slice(0, 25));
        }

        // Autocomplétion pour l'argument "team"
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

        if (focusedOption.name === "option") {
            const teams = [
                { name: "Démarrer", value: "start" }
            ];

            const filtered = teams.filter(t =>
                t.name.toLowerCase().includes(focusedOption.value.toLowerCase()) ||
                t.value.toLowerCase().includes(focusedOption.value.toLowerCase())
            );

            await interaction.respond(filtered.slice(0, 25));
        }
    }
};