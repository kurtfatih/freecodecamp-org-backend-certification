var express = require("express")
var app = express()

const absoluteViewIndexHtmlPath = __dirname + "/views/index.html"
const absoluteStyleSheetPath = __dirname + "/public"

app.use(express.static(absoluteStyleSheetPath))

app.get("/", (req, res) => {
  res.sendFile(absoluteViewIndexHtmlPath)
})

app.get("/json", (req, res) => {
  res.json({ message: "Hello json" })
})

module.exports = app
