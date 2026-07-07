const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.once("clientReady", () => {
  console.log(`Kick AFK+ is online as ${client.user.tag}`);

  checkMembers();
  setInterval(checkMembers, 60 * 60 * 1000);
});

async function checkMembers() {
  const guild = await client.guilds.fetch(process.env.GUILD_ID);
  const members = await guild.members.fetch();

  const now = Date.now();
  const seventyTwoHours = 72 * 60 * 60 * 1000;

  for (const member of members.values()) {
    if (member.user.bot) continue;
    if (member.permissions.has(PermissionsBitField.Flags.Administrator)) continue;

    const hasVaultDweller = member.roles.cache.has(process.env.VAULT_DWELLER_ROLE_ID);
    const beenHereTooLong = now - member.joinedTimestamp >= seventyTwoHours;

    if (!hasVaultDweller && beenHereTooLong) {
      try {
        await member.kick("Did not complete Rules/Roles within 72 hours");
        console.log(`Kicked ${member.user.tag}`);
      } catch (err) {
        console.log(`Could not kick ${member.user.tag}: ${err.message}`);
      }
    }
  }
}

client.login(process.env.TOKEN);