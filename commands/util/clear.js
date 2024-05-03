const { ApplicationCommandOptionType } = require("discord.js");
const { clearChannel } = require("../../functions/clear");
const { checkToken } = require("../../functions/check_token");

module.exports = {
 name: "clear",
 description: "Apague suas mensagens com algum usuário",
 options: [
  {
   name: "token",
   description: "Insira seu token",
   type: ApplicationCommandOptionType.String,
   required: true,
  },
  {
   name: "user",
   description: "Insira o id do usuário",
   type: ApplicationCommandOptionType.User,
   required: true,
  },
 ],

 run: async (client, interaction, args) => {
  let token = interaction.options.getString("token");
  token = token.replace(/["']/g, "");

  const user = interaction.options.getUser("user");

  const validToken = await checkToken(token);
  if (!validToken) {
   await interaction.reply({ content: "Token fornecido é inválido. Insira um token válido para prosseguir", ephemeral: true });
   return;
  }

  await interaction.reply({ content: `Iniciando a limpeza...`, ephemeral: true });

  const update = async (deleted, total) => {
   await interaction.editReply({
    content: `Progresso da Limpeza: **${deleted}/${total}**`,
    ephemeral: true,
   });
  };

  try {
   const { deletedCount } = await clearChannel(token, interaction.user.id, user.id, Infinity, update);
   await interaction.editReply({ content: `Limpeza concluída!\n**${deletedCount}** mensagens foram apagadas`, components: [], ephemeral: true });
  } catch (error) {
   console.log(error);
  }
 },
};