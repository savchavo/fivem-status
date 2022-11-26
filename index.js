const { Client, Collection, GatewayIntentBits, Partials, EmbedBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember] });
const config = require("./src/config.js");
const { readdirSync } = require("fs")
const moment = require("moment");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const fivereborn = require("fivereborn-query");
const Discord = require('discord.js');

let token = config.token

client.commands = new Collection()

const rest = new REST({ version: '10' }).setToken(token);

const log = l => { console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${l}`) };

//command-handler
const commands = [];
readdirSync('./src/commands').forEach(async file => {
  const command = require(`./src/commands/${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
})

client.on("ready", async () => {
  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands },
    );
  } catch (error) {
    console.error(error);
  }
  log(`${client.user.username} Aktif Edildi!`);
})

//event-handler
readdirSync('./src/events').forEach(async file => {
  const event = require(`./src/events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
})
//

// Server info 
client.on('interactionCreate', async interaction => {

  if (!interaction.isButton()) return;
  if (interaction.customId === "guncelle") {

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
        interaction.update({ embeds: [embed] })
      }
    });

  }

})

//nodejs-events
process.on("unhandledRejection", error => {
  console.log(error)
})
process.on("uncaughtException", error => {
  console.log(error)
})
process.on("uncaughtExceptionMonitor", error => {
  console.log(error)
})
//

client.login(token)
