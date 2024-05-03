const { slashArray } = require("../main");

module.exports = async (client) => {
 await client.user.setStatus("dnd");
 await client.application.commands.set(slashArray);

 process.on("unhandledRejection", (reason, promise) => {
  console.error(reason);
  console.log(promise);
 });

 process.on("uncaughtException", (error, origin) => {
  console.error(error);
  console.log(origin);
 });

 process.on("uncaughtExceptionMonitor", (error, origin) => {
  console.error(error);
  console.log(origin);
 });

 const guilds = client.guilds.cache.size;
 const users = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
 console.log(`[STATUS] ${guilds} Servers | ${users} Users\n[BOT] Connected in ${client.user.tag}`);
};