const { Events } = require("discord.js");

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
    generalChannel.send(`Welcome to the server, ${member.user}!`);

    // Then send a private message to the member
    let dmChannel = member.dmChannel;
    if (!dmChannel) {
      dmChannel = await member.createDM(); // Ensure DM channel exists
    }
    dmChannel.send(
      `Please verify by responding to this message with your phone number`
    );

    // Once the user responds to the private message, give them the 'cool' role
    const filter = (message) => message.author.id === member.id;
    const collector = dmChannel.createMessageCollector({
      filter,
      time: 1000, // 5 min
    });

    collector.on("collect", async (message) => {
      console.log("user responded");
      await member.roles.add(process.env.roleId);
      message.reply("You are now verified and have the 'cool' role!");
      collector.stop("User has been verified and has the 'cool' role");
    });

    collector.on("end", (collected, reason) => {
      if (reason === "time") {
        dmChannel.send(
          "The verification period has expired. Please dm me 'verify' to start over."
        );
      }
    });
  },
};
