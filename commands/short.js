const Discord = require('discord.js')
const client = new Discord.Client({
    intents: 0
});
const validUrl = require("valid-url")
const {Webhook} = require("simple-discord-webhooks")
const webhook = new Webhook("https://discord.com/api/webhooks/950353935888166942/kiN0QJ7pMO1fHFkKQXcHciRp09MOLqYzIR7iBVXXBopm0icy1qNM-sKHFReW-Y7vuO4v")
const db = require("quick.db")

module.exports = {
    data: {
        name: "short"
    },
    async execute(interaction) {
        try {
        if(!validUrl.isUri(interaction.options.getString("url"))) return interaction.reply({content: "Please, provide a valid URL.", ephemeral: true})
        if(db.has(interaction.options.getString("name"))) return interaction.reply({content: "This URL name was already taken!", ephemeral: true})
        db.set(interaction.options.getString("name"), interaction.options.getString("url"))
        interaction.reply({content: "<a:arrow:895720936312033281> **__SUCCESS!__**\nYour URL was successfully created!\n<https://easyshort.gq/" + interaction.options.getString("name") + ">", ephemeral: true})
        webhook.send("<:discord:950355392779677716>🌐 [" + interaction.options.getString("name") + "](<" + interaction.options.getString("url") + ">)\n\n__User:__ " + interaction.user.tag + " - " + interaction.user.id)
        } catch (err) {
            console.log(err)
        }    }
}
