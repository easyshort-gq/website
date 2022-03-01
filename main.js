const express = require('express')
const app = express()
const ejs = require('ejs')
const db = require("quick.db")
app.set("view engine", "ejs")

app.listen(3000, () => {
    console.log("http://localhost:3000")
    console.log("ejs @ " + ejs.VERSION)
})

app.get("/", (req, res) => {
    res.render("index", {
        linkaccor: db.all().filter(a => a.ID != "website_access" && a.ID != "executed_cmd").length,
        siteacc: db.get("website_access")
    })
})
app.get("/privacy", (req, res) => {
    res.render("privacy")
})
app.get("/terms", (req, res) => {
    res.render("terms")
})
app.get("*", (req, res) => {
    let x = req.path
    if(x == "/privacy" || x == "/terms") return;
    let linkCode = x.substr(1)
    db.add("website_access", 1)
    if(db.has(linkCode)) {
        res.redirect(db.get(linkCode))
    }
    else {
        res.render("notFound")
    }
})


const { Client, Collection, Intents} = require('discord.js')
const client =  new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]});
const fs = require('fs')
client.commands = new Collection();
const config = require("./config.json")

client.login(config.token)

const fileComandi = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of fileComandi) {
    const comando = require(`./commands/${file}`);
    client.commands.set(comando.data.name, comando);
} 

client.once('ready', () => {
    console.log(client.user.tag)
    client.user.setActivity('/short', { type: 'LISTENING' });
});

client.on('messageCreate', async (message) =>{
    if(message.content == "!slash"){
        const short = {
            name: 'report',
            description: 'Report an inappropriate URL.',
            options: [
                {
                    name: "url",
                    description: "The URL you want to report.",
                    type: "STRING",
                    required: true
                },
                {
                    name: "reason",
                    description: "The reason because you are reporting the URL.",
                    type: "STRING",
                    required: true
                }
            ]
        };
        const stats = {
            name: "delete-url",
            description: "Delete an URL. Developer only.",
            options: [
                {
                    name: "url",
                    description: "The URL to delete.",
                    type: "STRING",
                    required: true
                }
            ]
        }
        const comando1 = await client.application?.commands.create(short);
        console.log(comando1)
        const comando2 = await client.application?.commands.create(stats)
        console.log(comando2)
    }
})

client.on('interactionCreate', async (interaction) =>{
    if(!interaction.isCommand()) return;

    if (!client.commands.has(interaction.commandName)) return;
    try {
        await client.commands.get(interaction.commandName).execute(interaction)
    } catch (error) {
        console.error(error);
        await interaction.reply({content: "<a:arrow:895720936312033281> **Something went wrong!**", ephemeral: true })
    }
    db.add("executed_cmd", 1)
})