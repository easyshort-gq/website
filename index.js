const express = require('express')
const app = express()
const ejs = require('ejs')
const db = require("quick.db")
const bodyParser = require("body-parser")
const validUrl = require("valid-url")
app.set("view engine", "ejs")
const {Webhook} = require("simple-discord-webhooks")
const webhook = new Webhook("https://discord.com/api/webhooks/950353935888166942/kiN0QJ7pMO1fHFkKQXcHciRp09MOLqYzIR7iBVXXBopm0icy1qNM-sKHFReW-Y7vuO4v")
app.use(bodyParser.urlencoded({extended: false}))

app.enable("trust proxy")

app.listen(3000, () => {
    console.log("http://localhost:3000")
    console.log("ejs @ " + ejs.VERSION)
    console.log(db.all())
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
app.get("/db", (req, res) => {
    res.render("access-db")
})
app.get("/terms", (req, res) => {
    res.render("terms")
})
app.get("/short", (req, res) => {
    res.render("short", {
        success: null,
        errors: null
    })
})
app.get("*", (req, res) => {
    let x = req.path
    if(x == "/privacy" || x == "/terms" || x == "/linklist" || x == "/db") return;
    let linkCode = x.substr(1)
    db.add("website_access", 1)
    if(db.has(linkCode)) {
        res.redirect(db.get(linkCode))
    }
    else {
        res.render("notFound")
    }
})

app.post("/opendb", function(req, res) {
    if(req.body.psw == "gianni") {
        res.render("db", {
            links: db.all().filter(a => a.ID != "website_access" && a.ID != "executed_cmd"),
            dbv: db.version,
            servers: client.guilds.cache.map(g => g.name + " → " + g.memberCount + " members"),
            webvis: db.get("website_access"),
            shl: db.all().filter(a => a.ID != "website_access" && a.ID != "executed_cmd").length,
            ecmd: db.get("executed_cmd")
        })
    }
    else {
        res.send("Incorrect password!")
    }
})

app.post("/createurl", function(req, res) {
    let lungo = req.body.long
    let corto = req.body.short
    let ers = []
    if(!lungo || !corto) {
        res.render("short", {
            errors: "Please fill in all fields!",
            success: null
        })
    }
    else if(db.has(corto)) {
        res.render("short", {
            errors: "This URL name was already taken. Try another...",
            success: null
        })
    }
    else {
        db.set(corto, lungo)
        res.render("short", {
            success: true,
            errors: null
        })
        webhook.send("🌐 [" + corto + "](<" + lungo + ">)\n\n__IP Address:__ " + req.ip)
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

client.on('ready', () => {
    console.log(client.user.tag)
    client.user.setActivity('/short', { type: 'LISTENING' });
});

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
