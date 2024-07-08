const { Events } = require("discord.js");
const mongoose = require("mongoose");

async function connectToMongo() {
  try {
    const result = await mongoose.connect(process.env.mongoURI);
    console.log("Connected to MongoDB");
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    client.user.setActivity("Auther");

    connectToMongo();

    const guild = client.guilds.cache.get(process.env.guildId); // Use const
    if (!guild) {
      console.log("Guild not found!");
      process.exit(1);
    }
  },
};
