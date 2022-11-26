const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require('discord.js');
const config = require("../config.js");
const fivereborn = require("fivereborn-query");
const { read } = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server-info")
    .setDescription("Sunucuda bilgilerini atar!"),
  run: async (client, interaction) => {
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel(`Sunucuya Bağlan!`)
          .setEmoji("🎮")
          .setStyle(ButtonStyle.Link)
          .setURL(`${config.serverconnectlink}`)
      )
      .addComponents(
        new Discord.ButtonBuilder()
          .setLabel("🔄")
          .setStyle(Discord.ButtonStyle.Primary)
          .setCustomId("guncelle")
      )


    if (!interaction.member.permissions.has("8")) return interaction.reply({ content: "Yetkin Yok!", ephemeral: true })
    fivereborn.query(`${config.serverip}`, config.serverport, (err, data) => {
      if (err) {
        interaction.reply({ ephemeral: true, content: "Sunucu şuan çevrimdışı lütfen daha sonra tekrar dene!" })
      } else {
        let embed = new EmbedBuilder()
          .setTitle(`${config.servername}`)
          .setURL(`${config.serverconnectlink}`)
          .setColor("Green")
          .addFields({ name: "Sunucu Durumu", value: `\`\`\`AKTİF!\`\`\`` }, { name: "Oyuncu Sayısı", value: `\`\`\`${data.clients} / ${data.maxclients}\`\`\`` }, { name: "IP Adresi", value: `\`\`\`${config.serverip}\`\`\`` })
          .setImage("https://media.discordapp.net/attachments/951609559330459721/951609597628661770/Sunucu_aktif_red.png")
          .setFooter({ text: "developer by sav'#1000" })
        interaction.reply({ embeds: [embed], components: [row] })
      }
    });

  }
};
