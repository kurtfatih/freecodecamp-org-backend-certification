require("dotenv").config()
var express = require("express")
var app = express()

const absoluteViewIndexHtmlPath = __dirname + "/views/index.html"
const absoluteStyleSheetPath = __dirname + "/public"

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`)
  next()
})

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

app.get(
  "/now",
  (req, res, next) => {
    req.time = new Date().toString()
    next()
  },
  (req, res) => {
    res.json({ time: req.time })
  }
)

app.get("/:word/echo", (req, res) => {
  const { word } = req.params
  res.json({ echo: word })
})

module.exports = app
