require("dotenv").config()
var express = require("express")
var app = express()

const absoluteViewIndexHtmlPath = __dirname + "/views/index.html"
const absoluteStyleSheetPath = __dirname + "/public"

app.use("/public", express.static(absoluteStyleSheetPath))

app.get("/", (req, res) => {
  res.sendFile(absoluteViewIndexHtmlPath)
})

app.get("/json", (req, res) => {
  const msg = "Hello json"
  const jsonResponse =
    process.env.MESSAGE_STYLE === "uppercase" ? msg.toUpperCase() : msg
  res.json({ message: jsonResponse })
})

module.exports = app
