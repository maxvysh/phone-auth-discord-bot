const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    // Ignore messages from bots or not in DMs
    if (message.author.bot || message.channel.type !== 1) return;

    if (message.content.toLowerCase() === "verify") {
      const guild = await message.client.guilds.cache.get(process.env.guildId);
      if (!guild) {
        console.error("Guild not found!");
        return message.reply("Sorry we are experiencing an error verifying you, try again later.");
      }

      const member = await guild.members
        .fetch(message.author.id)
        .catch(console.error);
      if (!member) return message.reply("You are not a member of the guild.");

      const roleId = process.env.roleId; // The ID of the role you want to assign
      const role = guild.roles.cache.get(roleId);
      if (!role) {
        console.error("Role not found!");
        return message.reply(
          "Sorry we are experiencing an error verifying you, try again later."
        );
      }

      // Check if the member already has the role
      if (member.roles.cache.has(roleId)) {
        return message.reply("You are already verified.");
      }

      message.reply("Please respond to this message with your phone number.");

      const filter = (response) => response.author.id === message.author.id;
      const collector = message.channel.createMessageCollector({
        filter,
        time: process.env.countdown,
      });

      collector.on("collect", async (response) => {
        await member.roles.add(roleId);
        response.reply("You are now verified and have the 'cool' role!");
        collector.stop("User has been verified");
      });

      collector.on("end", (collected, reason) => {
        if (reason === "time") {
          message.reply(
            "The verification period has expired. Please dm me 'verify' to start over."
          );
        }
      });
    }
  },
};
