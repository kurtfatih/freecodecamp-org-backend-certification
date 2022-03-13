var express = require("express")
var app = express()

const absoluteViewIndexHtmlPath = __dirname + "/views/index.html"

console.log("dirname", path)
app.get("/", (req, res) => {
  res.sendFile(absoluteViewIndexHtmlPath)
})

module.exports = app
