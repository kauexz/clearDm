module.exports = async (client, interaction) => {
 if (interaction.isCommand()) {
  const slashCmd = client.slash.get(interaction.commandName);
  if (!slashCmd) return;

  const args = [];

  for (let optionCmd of interaction.options.data) {
   if (optionCmd.type === "SUB_COMMAND") {
    if (optionCmd.name) args.push(optionCmd.name);
    optionCmd.options?.forEach((x) => {
     if (x.value) args.push(x.value);
    });
   } else if (optionCmd.value) args.push(optionCmd.value);
  }

  try {
   slashCmd.run(client, interaction, args);
  } catch (err) {
   console.error("[ERROR] " + err);
  }
 }
};