require("dotenv").config()
const bodyParser = require("body-parser")

const URL = require("url").URL

const mongoose = require("mongoose")

const cors = require("cors")
const express = require("express")
const app = express()

const dns = require("dns")

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const ShortenerUrl = mongoose.model("ShortenerUrl", {
  url: { type: String },
  shortCode: { type: Number }
})

const apiEndPoint = "/api"
const timestamMicroServiceProjectUrl = "/timestamp-microservice"
const reqeustHeaderParserMicroserviceUrl = "/request-header-parser-microservice"
const urlShortenerMicroserviceUri = "/urlshortener"

// services api endpoints
const timestampMicroServiceApiEndPointUri =
  timestamMicroServiceProjectUrl + apiEndPoint + "/:date?"

const requestHeaderParserMicroServiceEndPoint =
  reqeustHeaderParserMicroserviceUrl + apiEndPoint

const urlShortenerShortUrlEndPoint =
  urlShortenerMicroserviceUri + apiEndPoint + "/shorturl"

const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(cors({ optionsSuccessStatus: 200 })) // some legacy browsers choke on 204
// http://expressjs.com/en/starter/static-files.html
app.use(timestamMicroServiceProjectUrl, express.static("timestamp/public"))
app.use(
  reqeustHeaderParserMicroserviceUrl,
  express.static("request-header-parser/public")
)
app.use(urlShortenerMicroserviceUri, express.static("urlshortener/public"))

// http://expressjs.com/en/starter/basic-routing.html

const services = [
  timestamMicroServiceProjectUrl,
  reqeustHeaderParserMicroserviceUrl,
  urlShortenerMicroserviceUri
].join(" ")

app.get("/", function (req, res) {
  const host = req.get("host")
  const protocol = req.protocol

  res.send(
    `Our services : <a href=${protocol}://${host}${reqeustHeaderParserMicroserviceUrl}>Timestamp</a>`
  )
})
app.get(urlShortenerMicroserviceUri, function (req, res) {
  res.sendFile(__dirname + "/urlshortener/views/index.html")
})

app.get(reqeustHeaderParserMicroserviceUrl, function (req, res) {
  res.sendFile(__dirname + "/request-header-parser/views/index.html")
})

app.get(
  requestHeaderParserMicroServiceEndPoint + "/whoami",
  function (req, res) {
    //     {"ipaddress":"159.20.14.100","language":"en-US,en;q=0.5",
    // "software":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0"}

    const software = req.headers["user-agent"]
    const language = req.headers["accept-language"]
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress

    res.json({ ipaddress: ipAddress, language, software })
  }
)

app.get(requestHeaderParserMicroServiceEndPoint, function (req, res) {
  res.send("Hello")
})

app.get(timestamMicroServiceProjectUrl, function (req, res) {
  res.sendFile(__dirname + "/timestamp/views/index.html")
})

app.get(timestampMicroServiceApiEndPointUri, function (req, res) {
  const { date } = req.params
  // date is string
  let currentDate
  let currentUnix
  const isTheInputString = isNaN(date)
  const isValidDateOrTimestamp = isTheInputString
    ? new Date(date).getTime() > 0
    : new Date(Number(date)).getTime() > 0

  if (date) {
    if (isValidDateOrTimestamp) {
      currentDate = new Date(date).toUTCString()
      currentUnix = new Date(date).valueOf()
      if (!isTheInputString) {
        // that means input is unix format
        const convertedUnixToDate = new Date(Number(date))
        currentDate = convertedUnixToDate.toUTCString()
        currentUnix = date
      }
      res.json({ unix: Number(currentUnix), utc: currentDate })
    } else {
      res.json({ error: "Invalid Date" })
    }
  } else {
    const date = new Date()
    const unitFormat = date.valueOf()
    const utcString = date.toUTCString()
    res.json({ unix: unitFormat, utc: utcString })
  }
})

app.get(
  urlShortenerShortUrlEndPoint + "/:shortCode",
  async function (req, res) {
    const { shortCode } = req.params
    if (!shortCode || isNaN(shortCode)) {
      return res.json({ error: "Invalid URL" })
    }

    const data = await ShortenerUrl.findOne({ shortCode: Number(shortCode) })

    if (!data) {
      return res.json({ error: "No short URL found for the given input" })
    }
    const redirectUrl = data.url
    return res.redirect(redirectUrl)
    // successfull req will redirect
    // return res.redirect(data.url)
  }
)

app.get(urlShortenerShortUrlEndPoint, async function (req, res) {
  return res.send("Not found")
})

app.post(urlShortenerShortUrlEndPoint, urlencodedParser, function (req, res) {
  const { url } = req.body
  if (!url) res.status(400).send("Url required")
  const urlObject = new URL(url)
  dns.lookup(urlObject.hostname, async (err) => {
    if (err) {
      res.json({
        error: "Invalid URL"
      })
    } else {
      const lengthOfCollection = await ShortenerUrl.count()
      const data = await ShortenerUrl.findOne({ url })
      if (!data) {
        const createdUrlData = await ShortenerUrl.create({
          url,
          shortCode: lengthOfCollection + 1
        })
        return res
          .status(200)
          .json({ original_url: url, short_url: createdUrlData.shortCode })
      }
      return res
        .status(200)
        .json({ original_url: url, short_url: data.shortCode })
    }
  })
})

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" })
})

// listen for requests :)
var listener = app.listen(process.env.PORT || 8000, function () {
  console.log("Your app is listening on port " + listener.address().port)
})
