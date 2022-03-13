require("dotenv").config()
const bodyParser = require("body-parser")
var express = require("express")
var app = express()

const absoluteViewIndexHtmlPath = __dirname + "/views/index.html"
const absoluteStyleSheetPath = __dirname + "/public"

app.use(bodyParser.urlencoded({ extended: false }))

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

app
  .get("/name", (req, res) => {
    const { first, last } = req.query
    const newObj = `${first} ${last}`
    res.json({ name: newObj })
  })
  .post("/name", (req, res) => {
    const { first, last } = req.body
    const newObj = `${first} ${last}`
    res.json({ name: newObj })
  })
module.exports = app
