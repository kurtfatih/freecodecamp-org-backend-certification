require("dotenv").config()
const bodyParser = require("body-parser")

const URL = require("url").URL

const mongoose = require("mongoose")

const cors = require("cors")
const express = require("express")
const app = express()

const dns = require("dns")
const apiRoutes = require("./routes")

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const ShortenerUrl = mongoose.model("ShortenerUrl", {
  url: { type: String },
  shortCode: { type: Number }
})

const apiBaseUri = "/api"
const reqeustHeaderParserMicroserviceUrl = "/request-header-parser-microservice"
const urlShortenerMicroserviceUri = "/urlshortener"

// services api endpoints

const requestHeaderParserMicroServiceEndPoint =
  reqeustHeaderParserMicroserviceUrl + apiBaseUri

const urlShortenerShortUrlEndPoint =
  urlShortenerMicroserviceUri + apiBaseUri + "/shorturl"

const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(cors({ optionsSuccessStatus: 200 })) // some legacy browsers choke on 204
// http://expressjs.com/en/starter/static-files.html
app.use(
  reqeustHeaderParserMicroserviceUrl,
  express.static("request-header-parser/public")
)
app.use(urlShortenerMicroserviceUri, express.static("urlshortener/public"))
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

// app.get(
//   exerciseMicroServiceExerciseEndPoint,
//   urlencodedParser,
//   async function (req, res) {
//     const { _id } = req.params
//     try {
//       const userData = await Users.findById(_id)
//       if (!userData) {
//         return res.send("[object Object]")
//       }
//       const exerciseData = await Exercise.findOne({ userId: _id })

//       if (!exerciseData) {
//         res.send("Not found")
//       }
//       return res.json({
//         _id,
//         username: userData.username,
//         date: exerciseData.date,
//         duration: exerciseData.duration,
//         description: exerciseData.description
//       })
//     } catch (e) {
//       return res.status(500).send(`${e.name}: ${e.message}`)
//     }
//   }
// )

app.get(urlShortenerMicroserviceUri, function (req, res) {
  res.sendFile(__dirname + "/urlshortener/views/index.html")
})

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

//utils
