const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

module.exports = {
    name: "reserver",
    description: "Réserve 3 jours consécutifs",
    permission: "no",
    dm: false,

    async run(client, interaction) {
        const today = new Date();
        const jours = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
        const mois = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

        // Initialisation de la semaine courante (offset = 0)
        const weekOffset = 0;

        // Création des boutons pour 7 jours (répartis sur 2 lignes)
        const dayRow1 = new ActionRowBuilder();
        const dayRow2 = new ActionRowBuilder();

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + (weekOffset * 7) + i);
            const label = `${jours[date.getDay()]} ${date.getDate()} ${mois[date.getMonth()]}`;
            const customId = `reserve_day_${weekOffset}_${i}`;

            const button = new ButtonBuilder()
                .setCustomId(customId)
                .setLabel(label)
                .setStyle(ButtonStyle.Secondary);

            // Première ligne : 4 boutons (0-3), deuxième ligne : 3 boutons (4-6)
            if (i < 4) {
                dayRow1.addComponents(button);
            } else {
                dayRow2.addComponents(button);
            }
        }

        // Boutons de navigation
        const navRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`reserve_nav_prev_${weekOffset}`)
                .setLabel("⬅️ Semaine précédente")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(weekOffset <= 0), // Désactiver si on est à la semaine courante ou avant
            new ButtonBuilder()
                .setCustomId(`reserve_nav_next_${weekOffset}`)
                .setLabel("Semaine suivante ➡️")
                .setStyle(ButtonStyle.Primary)
        );

        // Boutons de validation / annulation
        const confirmRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("reserve_confirm").setLabel("✅ Valider").setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId("reserve_cancel").setLabel("❌ Annuler").setStyle(ButtonStyle.Danger)
        );

        // Date de début et fin de la semaine affichée
        const startDate = new Date(today);
        startDate.setDate(today.getDate() + (weekOffset * 7));
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        // Embed initial
        const embed = new EmbedBuilder()
            .setTitle("🗓️ Réservation de 3 jours consécutifs")
            .setDescription(
                `**Semaine du ${startDate.getDate()} ${mois[startDate.getMonth()]} au ${endDate.getDate()} ${mois[endDate.getMonth()]} ${endDate.getFullYear()}**\n\n` +
                "Cliquez sur le **premier jour** de votre période de 3 jours consécutifs.\n" +
                "Utilisez les boutons de navigation pour changer de semaine.\n\n" +
                "**Sélection actuelle :** _Aucune pour l'instant_"
            )
            .setColor(0x2ECC71)
            .setFooter({ text: "💡 Les 3 jours seront automatiquement sélectionnés à partir du jour choisi" });

        await interaction.reply({
            embeds: [embed],
            components: [dayRow1, dayRow2, navRow, confirmRow],
            ephemeral: true
        });
    }
};