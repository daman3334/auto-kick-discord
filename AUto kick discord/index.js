const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.once("ready", () => {
  console.log(`Kick AFK+ is online as ${client.user.tag}`);

  setInterval(checkMembers, 60 * 60 * 1000);
  checkMembers();
});

async function checkMembers() {
  const guild = await client.guilds.fetch(process.env.GUILD_ID);
  const members = await guild.members.fetch();

  const now = Date.now();
  const seventyTwoHours = 72 * 60 * 60 * 1000;

  for (const member of members.values()) {
    if (member.user.bot) continue;

    const hasVaultDweller = member.roles.cache.has(process.env.VAULT_DWELLER_ROLE_ID);
    const beenHereTooLong = now - member.joinedTimestamp >= seventyTwoHours;

    if (!hasVaultDweller && beenHereTooLong) {
      await member.kick("Did not complete Rules/Roles within 72 hours");
      console.log(`Kicked ${member.user.tag}`);
    }
  }
}

client.login(process.env.TOKEN);