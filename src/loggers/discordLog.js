const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.on("ready", () => {
  console.log("Logger is as :", client.user.tag);
});
const token =
  "MTIxNTU3ODEzNDM5Nzg0NTU1NQ.GL6xPf.NbQjD-el7do0ZpKwushiWgQMyt_hxr73mQl-yE";
client.login(token);
client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;
  if (msg.content === "hello") {
    msg.reply("Hello, How can i assits you today");
  }
});
