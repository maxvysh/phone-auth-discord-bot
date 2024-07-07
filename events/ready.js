const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    client.user.setActivity("Auther");

    const guild = client.guilds.cache.get(process.env.guildId); // Use const
    if (!guild) {
      console.log("Guild not found!");
      process.exit(1);
    }
  },
};