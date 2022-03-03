const Discord = require('discord.js')
const client = new Discord.Client({
    intents: 0
});
const db = require("quick.db")

module.exports = {
    data: {
        name: "stats"
    },
    async execute(interaction) {
        try {
        let msg = "<a:arrow:895720936312033281> **__STATS__**\n\n__Shortened links:__ " + db.all().filter(a => a.ID != "website_access" && a.ID != "executed_cmd").length + "\n__Website access:__ " + db.get("website_access") + "\n__Executed commands:__ " + db.get("executed_cmd")
        interaction.reply({content: msg, ephemeral: true})
        } catch (err) {
            console.log(err)
        }
    }
}
