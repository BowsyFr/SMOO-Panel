const { Client } = require("ssh2");
const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    name: "start",
    description: "Démarre le serveur via SSH",
    permission: "no",
    dm: false,

    async run(client, interaction) {
        const logChannelId = "1377381895246970880";
        const sshConfig = {
            host: "141.253.115.12",
            port: 22,
            username: "ubuntu",
            privateKey: fs.readFileSync("/Users/bowsy/Downloads/ssh-key-2025-05-24.key"),
        };

        try {
            const initMessage = await interaction.reply({
                content: "⏳ Connexion SSH en cours...",
                ephemeral: true
            });

            const conn = new Client();

            conn.on("ready", async () => {
                console.log("✅ Connexion SSH établie.");

                // Supprime le message de connexion
                await interaction.deleteReply();

                // Envoie un nouveau message éphémère de confirmation
                await interaction.followUp({
                    content: "✅ Connexion établie. Démarrage en cours...",
                    ephemeral: true
                });

                conn.exec("./start.sh", { pty: true }, async (err, stream) => {
                    if (err) {
                        await interaction.followUp({
                            content: `❌ Erreur lors de l'exécution : ${err.message}`,
                            ephemeral: true
                        });
                        conn.end();
                        return;
                    }

                    let output = "";
                    let serverStarted = false;

                    stream
                        .on("close", async (code, signal) => {
                            console.log(`✅ Commande terminée avec code ${code}, signal ${signal}`);
                            conn.end();

                            // Envoie le log complet dans le salon dédié
                            const logChannel = await client.channels.fetch(logChannelId);
                            if (logChannel?.isTextBased()) {
                                await logChannel.send(`📄 **Sortie complète de /start :**\n\`\`\`\n${output || "Aucune sortie"}\n\`\`\``);
                            }
                        })
                        .on("data", async (data) => {
                            const message = data.toString();
                            console.log("STDOUT:", message);
                            output += message;

                            // Détection du message de démarrage du serveur
                            if (!serverStarted && message.includes("[Server] Listening on 0.0.0.0:1027")) {
                                serverStarted = true;
                                await interaction.channel.send("✅ **Serveur démarré !**");
                            }
                        })
                        .stderr.on("data", (data) => {
                            const errMessage = data.toString();
                            console.log("STDERR:", errMessage);
                            output += "Erreur: " + errMessage;
                        });
                });
            });

            conn.on("error", async (err) => {
                console.error("❌ Erreur de connexion SSH :", err);
                await interaction.followUp({
                    content: `❌ Erreur SSH : ${err.message}`,
                    ephemeral: true
                });
            });

            conn.connect(sshConfig);

        } catch (error) {
            console.error("❌ Erreur dans /start :", error);
            await interaction.reply({
                content: "❌ Une erreur est survenue.",
                ephemeral: true
            });
        }
    }
};