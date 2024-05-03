const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const fs = require("fs").promises;
const config = require("./config.json");

const client = new Client({
 intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers],
 partials: [Partials.Channel, Partials.Message],
});

client.slash = new Collection();
let slashArray = [];

async function loadEvents() {
 const eventFiles = await fs.readdir("./events/");
 for (const file of eventFiles.filter((f) => f.endsWith(".js"))) {
  const eventName = file.split(".")[0];
  const event = require(`./events/${file}`);
  console.log(`[EVENTS] ${eventName} Loaded`);
  client.on(eventName, (...args) => event(client, ...args));
 }
}

async function loadSlashCommands() {
 const commandFolders = await fs.readdir("./commands/");
 for (const folder of commandFolders) {
  const commandFiles = await fs.readdir(`./commands/${folder}`);
  for (const file of commandFiles.filter((f) => f.endsWith(".js"))) {
   const command = require(`./commands/${folder}/${file}`);
   if (command.name) {
    client.slash.set(command.name, command);
    slashArray.push(command);
    console.log(`[SLASH COMMANDS] ${command.name} Loaded`);
   }
  }
 }
}

async function main() {
 await loadEvents();
 await loadSlashCommands();
 client.login(config.token);
}

main();

module.exports = { client, slashArray };