const app = require('express')()
const ejs = require('ejs')
const bodyParser = require("body-parser")
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: false}))
const { createClient } = require("@supabase/supabase-js")
const { WebhookClient, MessageEmbed } = require("discord.js")
const wh = new WebhookClient({ url: "https://discord.com/api/webhooks/950353789653757973/WiNaS1KajVng8afpdWzdrL5hi2LnthgBitMrhXmeZoaF__Wz37Cdzq7KBP3J2eXwmXeA" })

const supabase = createClient("https://zlrybotjnovnzmdexvxp.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpscnlib3Rqbm92bnptZGV4dnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDc3MTUxMDYsImV4cCI6MTk2MzI5MTEwNn0.8hjsacCgg3NdTCwZsmGRU6PjeEDC6k05N8VD0nmTWco")

async function shortURL(l,s) {
    let { data, error } = await
        supabase
            .from("easyshort")
            .insert([{ code: s, url: l, clicks: 0}])
    return data
}

app.enable("trust proxy")

app.listen(3000, () => {
    console.log("http://localhost:3000")
    console.log("ejs @ " + ejs.VERSION)
})

app.get("/", (req, res) => {
    res.render("index", {
        notFound: false,
        success: false,
        errors: false
    })
})

app.get("/about", (req, res) => {
    res.render("about")
})

app.get("/report", (req, res) => {
    res.render("report", {
        success: false,
        errors: false
    })
})

app.get("/clicks", (req, res) => {
    res.render("clicks", {
        success: false,
        errors: false
    })
})



app.get("*", async (req, res) => {
    let x = req.path
    if(x == "/about" || x == "/report") return;
    let linkCode = x.substr(1)
    let data = await supabase.from("easyshort").select("url, code, clicks").eq("code", linkCode)
    if(data.data.length) {
        res.redirect(data.data[0].url)
        await supabase.from("easyshort").update({ "clicks": data.data[0].clicks +1 }).match({ "code": linkCode})
    }
    else {
        res.render("index", {
            notFound: true,
            success: false,
            errors: false
        })
    }
})

app.post("/createurl", function(req, res) {
    let lungo = req.body.long
    let corto = ""
    let chars = "abcdefghijklmnopqrstuvwxyz1234567890"
    for(let i = 0;i<5;i++) {
        corto += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    if(!lungo) {
        res.render("index", {
            notFound: false,
            errors: true,
            success: false
        })
    }
    else {
        shortURL(lungo, corto)
        res.render("index", {
            notFound: false,
            success: [corto, lungo],
            errors: false
        })
    }
})

app.post("/getc", async (req, res) => {
    let url = req.body.url
    let data = await supabase.from("easyshort").select("code, clicks").eq("code", url)
    if(data.data.length) {
        res.render("clicks", {
            success: data.data[0].clicks + " clicks",
            errors: false
        })
    }
    else {
        res.render("clicks", {
            success: false,
            errors: true
        })
    }
})

app.post("/reporturl", (req, res) => {
    let url = req.body.url
    let motivo = req.body.motivo

    let embed = new MessageEmbed()
    .setAuthor("easyshort.gq", "https://cdn-icons-png.flaticon.com/512/3214/3214679.png", "https://easyshort.gq")
    .setDescription("**__URL:__** ```" + url + "```\n**__MOTIVO:__** ```" + motivo + "```")
    .setColor("BLUE")
    wh.send({
        content: "**NEW REPORT FROM IP:** " + req.ip,
        username: "",
        avatarURL: "",
        embeds: [embed]
    })

    res.render("report", {
        success: true,
        errors: false
    })
})