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

    // Find the general channel ID
    // const regexChat = /general/i;
    // guild.channels.cache
    //   .filter((channel) => channel.type === 0)
    //   .forEach((channel) => {
    //     if (regexChat.test(channel.name)) {
    //       console.log(`General channel found: ${channel.name}`);
    //       generalId = channel.id;
    //     }
    //   });

    // If a new member joins, send a message to the general channel
    // client.on(Events.GuildMemberAdd, (member) => {
    //   const channel = guild.channels.cache.get(generalId);
    //   channel.send(`Welcome to the server, ${member.user}!`);

    //   // Then send a private message to the member
    //   member.send(`Please verify, ${member.user}!`);

    //   // Once the user responds to the private message, give them the 'cool' role
    //   client.on(Events.MessageCreate, (message) => {
    //     console.log("user responded");
    //     console.log(message.channel.type);
    //     if (message.channel.type === 0 && message.author.id === member.id) {
    //       member.roles.add(process.env.roleId);
    //       console.log("role added");
    //       // Respond to the user
    //       message.reply("You are now verified and have the 'cool' role!");
    //     }
    //   });
    // });
  },
};