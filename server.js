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

const Users = mongoose.model("Users", {
  username: { type: String, required: true }
})

const Exercise = mongoose.model("Exercises", {
  userId: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: String, required: false }
})

const apiBaseUri = "/api"
const timestamMicroServiceProjectUrl = "/timestamp-microservice"
const reqeustHeaderParserMicroserviceUrl = "/request-header-parser-microservice"
const urlShortenerMicroserviceUri = "/urlshortener"
const exerciseMicroServiceUrl = "/exercise-tracker"

// services api endpoints
const timestampMicroServiceApiEndPointUri =
  timestamMicroServiceProjectUrl + apiBaseUri + "/:date?"

const requestHeaderParserMicroServiceEndPoint =
  reqeustHeaderParserMicroserviceUrl + apiBaseUri

const urlShortenerShortUrlEndPoint =
  urlShortenerMicroserviceUri + apiBaseUri + "/shorturl"

const exerciseMicroServiceUserEndPoint =
  exerciseMicroServiceUrl + apiBaseUri + "/users"
const exerciseMicroServiceExerciseEndPoint =
  exerciseMicroServiceUserEndPoint + "/:_id" + "/exercises"
const exerciseMicroServiceLogEndPoint =
  exerciseMicroServiceUserEndPoint + "/:_id/" + "logs"

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

// TODO MAIN SITE
// app.get("/", function (req, res) {
//   const host = req.get("host")
//   const protocol = req.protocol

//   res.send(
//     `Our services : <a href=${protocol}://${host}${reqeustHeaderParserMicroserviceUrl}>Timestamp</a>`
//   )
// })

app.get(exerciseMicroServiceUrl, function (req, res) {
  res.sendFile(__dirname + "/exercise-tracker/views/index.html")
})

app.get(exerciseMicroServiceUserEndPoint, async function (_, res) {
  try {
    const data = await Users.find()
    return res.send(data)
  } catch (e) {
    return res.status(500).send(`${e.name}: ${e.message}`)
  }
})

app.post(
  exerciseMicroServiceUserEndPoint,
  urlencodedParser,
  async function (req, res) {
    const { username } = req.body
    try {
      const data = await Users.create({ username })
      return res.json({ username: data.username, _id: data._id })
    } catch (e) {
      return res.status(500).send(`${e.name}: ${e.message}`)
    }
  }
)

app.get(
  exerciseMicroServiceExerciseEndPoint,
  urlencodedParser,
  async function (req, res) {
    const { _id } = req.params
    try {
      const userData = await Users.findById(_id)
      if (!userData) {
        return res.send("[object Object]")
      }
      const exerciseData = await Exercise.findOne({ userId: _id })

      if (!exerciseData) {
        res.send("Not found")
      }
      return res.json({
        _id,
        username: userData.username,
        date: exerciseData.date,
        duration: exerciseData.duration,
        description: exerciseData.description
      })
    } catch (e) {
      return res.status(500).send(`${e.name}: ${e.message}`)
    }
  }
)

app.get(exerciseMicroServiceLogEndPoint, async function (req, res) {
  const { _id } = req.params
  const { limit, from, to } = req.query

  try {
    const userData = await Users.findById(_id)
    if (!userData) {
      return res.send("[object Object]")
    }

    const exerciseData = await Exercise.find({ userId: _id })
      .select(["-_id", "-userId"])
      .select("-__v")
      .limit(limit)
    let exerciseDataLog = exerciseData
    if (from || to) {
      let fromDate = new Date(0)
      let toDate = new Date()
      if (from) {
        fromDate = new Date(from)
      }
      if (to) {
        toDate = new Date(to)
      }
      fromDate = fromDate.getTime()
      toDate = toDate.getTime()
      exerciseDataLog = exerciseData.filter(({ date }) => {
        let logDate = new Date(date).getTime()
        return logDate >= fromDate && logDate <= toDate
      })
    }
    // .select("-userId")
    return res.json({
      _id,
      username: userData.username,
      count: from || to ? exerciseDataLog.length : exerciseData.length,
      log: exerciseDataLog
    })
  } catch (e) {
    return res.status(500).send(`${e.name}: ${e.message}`)
  }
})

app.post(
  exerciseMicroServiceExerciseEndPoint,
  [
    urlencodedParser,
    (req, _, next) => {
      const date = req.body.date
      const isDateValid = isValidDate(date)
      req.date = { isDateValid, value: date }
      next()
    }
  ],
  async function (req, res) {
    const { _id } = req.params
    const description = req.body.description
    const duration = req.body.duration
    const isDateValid = req.date.isDateValid
    if (!isDateValid) {
      return res.send("Date format is not valid yyyy/mm/dd")
    }

    const date =
      req.date.value.length > 0
        ? new Date(req.date.value).toDateString()
        : new Date().toDateString()

    try {
      const userData = await Users.findById(_id)

      const createdExerciseData = await Exercise.create({
        userId: _id,
        description,
        username: userData.username,
        duration,
        date
      })

      return res.json({
        _id: createdExerciseData.userId,
        username: userData.username,
        date: createdExerciseData.date,
        duration: createdExerciseData.duration,
        description: createdExerciseData.description
      })
    } catch (e) {
      return res.send(e)
    }
  }
)

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

//utils
const isValidDate = (value) => {
  if (!value) return true
  if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) return false

  const date = new Date(value)
  if (!date.getTime()) return false
  return date.toISOString().slice(0, 10) === value
}
