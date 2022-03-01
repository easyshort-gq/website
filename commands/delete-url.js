const Discord = require('discord.js')
const client = new Discord.Client({
    intents: 0
});
const db = require("quick.db")

module.exports = {
    data: {
        name: "delete-url"
    },
    async execute(interaction) {
        if(interaction.user.id != "766336575793135697") return interaction.reply({content: "You can't use this developer-only command.", ephemeral: true})
        let url = interaction.options.getString("url")
        db.delete(url)
        interaction.reply({content: "The `" + url + "` was successfully deleted!", ephemeral: true})
    }
}