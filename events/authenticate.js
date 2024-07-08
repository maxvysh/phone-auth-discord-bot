const { Events } = require("discord.js");
const User = require("../models/user");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    // Make sure this function is async
    const guild = member.guild;
    const generalChannel = guild.channels.cache.get(process.env.generalId);
    if (!generalChannel) {
      console.error("General channel not found!");
      return;
    }

    // Send a welcome message to the general channel
    generalChannel.send(`${process.env.welcomeMessage} ${member.user}!`);

    // Then send a private message to the member
    let dmChannel = member.dmChannel;
    if (!dmChannel) {
      dmChannel = await member.createDM(); // Ensure DM channel exists
    }
    dmChannel.send(
      process.env.verifyMessage
    );

    // Once the user responds to the private message, give them the 'cool' role
    const filter = (message) => message.author.id === member.id;
    const collector = dmChannel.createMessageCollector({
      filter,
      time: process.env.countdown, // 5 min
    });

    collector.on("collect", async (message) => {
      // Check if the guild is available
      if (!guild) {
        console.error("Guild not found!");
        return message.reply(
          "Sorry we are experiencing an error verifying you, try again later."
        );
      }

      // Check if the role is available
      if (!guild.roles.cache.has(process.env.roleId)) {
        console.error("Role not found!");
        return message.reply(
          "Sorry we are experiencing an error verifying you, try again later."
        );
      }

      // Check if the member is part of the guild
      if (!member) {
        return message.reply("You are not a member of the server.");
      }

      // Check if the member already has the role
      if (member.roles.cache.has(process.env.roleId)) {
        return message.reply("You are already verified.");
      }

      await member.roles.add(process.env.roleId);
      message.reply(process.env.verifySuccess);
      User.create({
        username: member.user.username,
        phonenumber: message.content,
      }).catch((err) => console.log('error creating user', err));
      collector.stop("User has been verified");
    });

    collector.on("end", (collected, reason) => {
      if (reason === "time") {
        dmChannel.send(
          process.env.verifyExpired
        );
      }
    });
  },
};
