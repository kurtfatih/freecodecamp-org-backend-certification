var express = require("express")
var app = express()

const absoluteViewIndexHtmlPath = __dirname + "/views/index.html"
const absoluteStyleSheetPath = __dirname + "/public"

app.use(express.static(absoluteStyleSheetPath))

app.get("/", (req, res) => {
  res.sendFile(absoluteViewIndexHtmlPath)
})

module.exports = app
