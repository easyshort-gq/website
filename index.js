const express = require("express")
const app = express()
const ejs = require("ejs")
const bodyParser = require("body-parser")
const config = require("./config.json")
const { createClient } = require("@supabase/supabase-js")
const supabase = createClient(config.db_url, config.db_key)

app.use("/static", express.static("static"))
app.enable("trust proxy")
app.use(bodyParser.urlencoded({extended: false}))
app.set("view engine", "ejs")

app.listen(3000, () => {
    console.log("easyshort.gq is live ✨")
})

app.get("/", (req, res) => {
    res.render("index")
})
app.get("/about", (req, res) => {
    res.render("about")
})
app.get("/terms", (req, res) => {
    res.render("about")
})
app.get("/clicks", (req, res) => {
    res.render("clicks", {
        success: false,
        errors: false
    })
})
app.get("/api", (req, res) => {
    res.redirect("https://api.easyshort.gq/")
})
app.get("/database", (req, res) => {
    res.redirect("https://status.supabase.com/")
})

//REDIRECT VALID URL CODES
app.get("*", async (req, res) => {
    let x = req.path
    if(x == "/about" || x == "/terms" || x == "/clicks") return;
    let linkCode = x.substr(1)
    let data = await supabase.from("easyshort").select("url, code, clicks").eq("code", linkCode)
    if(data.data.length) {
        res.redirect(data.data[0].url)
        await supabase.from("easyshort").update({ "clicks": data.data[0].clicks +1 }).match({ "code": linkCode})
    }
    else {
        res.render("404", {
            url: linkCode
        })
    }
})

app.post("/createurl", async (req, res) => {
    let lungo = req.body.url
    let corto = ""
    let chars = "abcdefghijklmnopqrstuvwxyz1234567890"
    for(let i = 0;i<5;i++) {
        corto += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    await supabase.from("easyshort").insert([{ code: corto, url: lungo, clicks: 0}])
    res.render("shortened", {
        code: corto
    })
})

app.post("/getc", async (req, res) => {
    let input = req.body.url
    let url = input.replace("https:", "").replace("easyshort.gq", "").replace("/", "").replace("//", "")
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