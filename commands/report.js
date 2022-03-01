const Discord = require('discord.js')
const client = new Discord.Client({
    intents: 0
});
const db = require("quick.db")
const {Webhook} = require("simple-discord-webhooks")
const webhook = new Webhook("https://discord.com/api/webhooks/947913082380890182/tdjeiuFlfhhju4JhxBy4FSqzNoXpFgAKmqZSTidqjheSjvkP8fxK46tkBkdrdlySyapV")

module.exports = {
    data: {
        name: "report"
    },
    async execute(interaction) {
        let url = interaction.options.getString("url")
        let reason = interaction.options.getString("reason")
        if(!db.has(url)) return interaction.reply({content: "You have provided an URL that does not exist.", ephemeral: true})
        webhook.send("<a:arrow:895720936312033281> **__NEW REPORT__**\n\n__URL:__ [" + url + "](<" + db.get(url) + ">)\n__Reason:__ " + reason + "\n__User:__ " + interaction.user.tag)
        interaction.reply({content: "<a:arrow:895720936312033281> **Your report was successfully sent! Join the [this server](<https://discord.gg/X4nGGPvJJY>) to stay updated on the progress of the removal request.**", ephemeral: true})
    }
}