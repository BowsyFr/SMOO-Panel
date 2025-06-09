const Discord = require('discord.js');

// Stockage temporaire des sélections par utilisateur (en mémoire)
const userSelections = {};

module.exports = async (client, interaction) => {
    try {
        // Commande slash classique
        if (interaction.type === Discord.InteractionType.ApplicationCommand) {
            const command = require(`../Commands/${interaction.commandName}`);
            await command.run(client, interaction, command.options);
            return;
        }

        // Autocomplétion (votre code existant reste identique)
        if (interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {
            const focusedOption = interaction.options.getFocused(true);

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
                return;
            }

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

                    const lines = listMessage.content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                    if (lines.length === 0) return interaction.respond([]);

                    const players = [];
                    const extractName = (line) => {
                        const match = line.match(/^(.+?)\s*\(/);
                        if (match) return match[1].trim();
                        return line.trim();
                    };

                    const firstLine = lines[0];
                    const firstPlayerRaw = firstLine.slice(5).trim();
                    if (firstPlayerRaw.length > 0) players.push({ name: extractName(firstPlayerRaw), value: extractName(firstPlayerRaw) });

                    for (let i = 1; i < lines.length; i++) {
                        players.push({ name: extractName(lines[i]), value: extractName(lines[i]) });
                    }

                    const filtered = players.filter(p =>
                        p.name.toLowerCase().includes(focusedOption.value.toLowerCase())
                    ).slice(0, 25);

                    await interaction.respond(filtered);
                } catch (err) {
                    console.error("Erreur autocomplétion joueur:", err);
                    await interaction.respond([]);
                }
                return;
            }

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
                return;
            }

            if (focusedOption.name === "option") {
                const options = [
                    { name: "Démarrer", value: "start" }
                ];

                const filtered = options.filter(o =>
                    o.name.toLowerCase().includes(focusedOption.value.toLowerCase()) ||
                    o.value.toLowerCase().includes(focusedOption.value.toLowerCase())
                );

                await interaction.respond(filtered.slice(0, 25));
                return;
            }
        }

        // Gestion des interactions boutons (réservation améliorée)
        if (interaction.isButton()) {
            const userId = interaction.user.id;
            const customId = interaction.customId;

            // Navigation entre les semaines
            if (customId.startsWith("reserve_nav_")) {
                const parts = customId.split("_");
                const direction = parts[2]; // "prev" ou "next"
                const currentOffset = parseInt(parts[3]);

                let newOffset = currentOffset;
                if (direction === "prev") {
                    newOffset = Math.max(0, currentOffset - 1); // Ne pas aller dans le passé
                } else if (direction === "next") {
                    newOffset = Math.min(52, currentOffset + 1); // Limite à ~1 an
                }

                await updateWeekDisplay(interaction, newOffset);
                return;
            }

            // Sélection d'un jour (premier jour des 3 consécutifs)
            if (customId.startsWith("reserve_day_")) {
                const parts = customId.split("_");
                const weekOffset = parseInt(parts[2]);
                const dayIndex = parseInt(parts[3]);

                // Calculer la date absolue du jour sélectionné
                const today = new Date();
                const selectedDate = new Date(today);
                selectedDate.setDate(today.getDate() + (weekOffset * 7) + dayIndex);

                // Vérifier qu'on ne sélectionne pas dans le passé
                if (selectedDate < today.setHours(0, 0, 0, 0)) {
                    await interaction.reply({
                        content: "❌ Vous ne pouvez pas sélectionner une date dans le passé.",
                        ephemeral: true
                    });
                    return;
                }

                // Stocker la sélection (3 jours consécutifs à partir de ce jour)
                userSelections[userId] = {
                    startDate: selectedDate,
                    weekOffset: weekOffset,
                    dayIndex: dayIndex
                };

                await updateWeekDisplay(interaction, weekOffset, userSelections[userId]);
                return;
            }

            // Validation de la réservation
            if (customId === "reserve_confirm") {
                const selection = userSelections[userId];

                if (!selection) {
                    await interaction.reply({ content: "❌ Veuillez sélectionner une période de **3 jours**.", ephemeral: true });
                    return;
                }

                const jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
                const mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

                const dates = [];
                for (let i = 0; i < 3; i++) {
                    const date = new Date(selection.startDate);
                    date.setDate(selection.startDate.getDate() + i);
                    dates.push(`${jours[date.getDay()]} ${date.getDate()} ${mois[date.getMonth()]} ${date.getFullYear()}`);
                }

                delete userSelections[userId];

                await interaction.update({
                    content: `✅ **Réservation confirmée pour 3 jours consécutifs :**\n${dates.map(d => `• ${d}`).join('\n')}`,
                    embeds: [],
                    components: []
                });
                return;
            }

            // Annulation
            if (customId === "reserve_cancel") {
                delete userSelections[userId];
                await interaction.update({
                    content: `❌ Réservation annulée.`,
                    embeds: [],
                    components: []
                });
                return;
            }
        }
    } catch (error) {
        console.error("Erreur interactionCreate:", error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: "❌ Une erreur est survenue.", ephemeral: true });
        }
    }
};

// Fonction pour mettre à jour l'affichage de la semaine
async function updateWeekDisplay(interaction, weekOffset, selection = null) {
    const today = new Date();
    const jours = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const mois = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

    // Création des boutons pour 7 jours (répartis sur 2 lignes)
    const dayRow1 = new Discord.ActionRowBuilder();
    const dayRow2 = new Discord.ActionRowBuilder();

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + (weekOffset * 7) + i);
        const label = `${jours[date.getDay()]} ${date.getDate()} ${mois[date.getMonth()]}`;
        const customId = `reserve_day_${weekOffset}_${i}`;

        let buttonStyle = Discord.ButtonStyle.Secondary;

        // Mettre en évidence la sélection (3 jours consécutifs)
        if (selection && selection.weekOffset === weekOffset) {
            if (i >= selection.dayIndex && i < selection.dayIndex + 3) {
                buttonStyle = Discord.ButtonStyle.Success;
            }
        }

        // Désactiver les boutons du passé
        const isPast = date < new Date().setHours(0, 0, 0, 0);

        const button = new Discord.ButtonBuilder()
            .setCustomId(customId)
            .setLabel(label)
            .setStyle(buttonStyle)
            .setDisabled(isPast);

        // Première ligne : 4 boutons (0-3), deuxième ligne : 3 boutons (4-6)
        if (i < 4) {
            dayRow1.addComponents(button);
        } else {
            dayRow2.addComponents(button);
        }
    }

    // Boutons de navigation
    const navRow = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
            .setCustomId(`reserve_nav_prev_${weekOffset}`)
            .setLabel("⬅️ Semaine précédente")
            .setStyle(Discord.ButtonStyle.Primary)
            .setDisabled(weekOffset <= 0),
        new Discord.ButtonBuilder()
            .setCustomId(`reserve_nav_next_${weekOffset}`)
            .setLabel("Semaine suivante ➡️")
            .setStyle(Discord.ButtonStyle.Primary)
            .setDisabled(weekOffset >= 52) // Limite à ~1 an
    );

    // Boutons de validation / annulation
    const confirmRow = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder().setCustomId("reserve_confirm").setLabel("✅ Valider").setStyle(Discord.ButtonStyle.Success),
        new Discord.ButtonBuilder().setCustomId("reserve_cancel").setLabel("❌ Annuler").setStyle(Discord.ButtonStyle.Danger)
    );

    // Dates de début et fin de la semaine
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + (weekOffset * 7));
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    // Description avec sélection
    let description = `**Semaine du ${startDate.getDate()} ${mois[startDate.getMonth()]} au ${endDate.getDate()} ${mois[endDate.getMonth()]} ${endDate.getFullYear()}**\n\n` +
        "Cliquez sur le **premier jour** de votre période de 3 jours consécutifs.\n" +
        "Utilisez les boutons de navigation pour changer de semaine.\n\n";

    if (selection) {
        const selectionDates = [];
        for (let i = 0; i < 3; i++) {
            const date = new Date(selection.startDate);
            date.setDate(selection.startDate.getDate() + i);
            selectionDates.push(`${jours[date.getDay()]} ${date.getDate()} ${mois[date.getMonth()]}`);
        }
        description += `**Sélection actuelle :** ${selectionDates.join(', ')}`;
    } else {
        description += "**Sélection actuelle :** _Aucune pour l'instant_";
    }

    const embed = new Discord.EmbedBuilder()
        .setTitle("🗓️ Réservation de 3 jours consécutifs")
        .setDescription(description)
        .setColor(0x2ECC71)
        .setFooter({ text: "💡 Les 3 jours seront automatiquement sélectionnés à partir du jour choisi" });

    await interaction.update({
        embeds: [embed],
        components: [dayRow1, dayRow2, navRow, confirmRow]
    });
}