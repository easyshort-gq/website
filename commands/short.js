const Discord = require('discord.js')
const client = new Discord.Client({
    intents: 0
});
const validUrl = require("valid-url")
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
        } catch (err) {
            console.log(err)
        }
    }
}
