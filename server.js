require("dotenv").config()
const bodyParser = require("body-parser")

const mongoose = require("mongoose")

const cors = require("cors")
const express = require("express")
const app = express()

const apiRoutes = require("./routes")

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const apiBaseUri = "/api"
const reqeustHeaderParserMicroserviceUrl = "/request-header-parser-microservice"

// services api endpoints

const requestHeaderParserMicroServiceEndPoint =
  reqeustHeaderParserMicroserviceUrl + apiBaseUri

const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(cors({ optionsSuccessStatus: 200 })) // some legacy browsers choke on 204
// http://expressjs.com/en/starter/static-files.html
app.use(
  reqeustHeaderParserMicroserviceUrl,
  express.static("request-header-parser/public")
)
app.use("/api", apiRoutes)

// http://expressjs.com/en/starter/basic-routing.html

// TODO MAIN SITE
// app.get("/", function (req, res) {
//   const host = req.get("host")
//   const protocol = req.protocol

//   res.send(
//     `Our services : <a href=${protocol}://${host}${reqeustHeaderParserMicroserviceUrl}>Timestamp</a>`
//   )
// })

app.get(reqeustHeaderParserMicroserviceUrl, function (req, res) {
  res.sendFile(__dirname + "/request-header-parser/views/index.html")
})

app.get(
  requestHeaderParserMicroServiceEndPoint + "/whoami",
  function (req, res) {
    const software = req.headers["user-agent"]
    const language = req.headers["accept-language"]
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress

    res.json({ ipaddress: ipAddress, language, software })
  }
)

app.get(requestHeaderParserMicroServiceEndPoint, function (req, res) {
  res.send("Hello")
})

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" })
})

// listen for requests :)
var listener = app.listen(process.env.PORT || 8000, function () {
  console.log("Your app is listening on port " + listener.address().port)
})

//utils
