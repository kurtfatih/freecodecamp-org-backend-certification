// server.js
// where your node app starts

// init project
var express = require("express")
var app = express()

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors")
app.use(cors({ optionsSuccessStatus: 200 })) // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"))

// http://expressjs.com/en/starter/basic-routing.html
const apiEndPoint = "/api"
const timestamMicroServiceProjectUrl = "/timestamp-microservice"
const timestampMicroServiceApiEndPointUri =
  timestamMicroServiceProjectUrl + apiEndPoint + "/:date?"

const services = [timestamMicroServiceProjectUrl].join(" ")

app.get("/", function (req, res) {
  const host = req.get("host")
  const protocol = req.protocol
  res.send(
    `Our services : <a href=${protocol}://${host}${services}>Timestamp</a>`
  )
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
        const activeDateToPassTest = convertedUnixToDate.setMinutes(
          convertedUnixToDate.getMinutes() - 3
        )

        currentDate = activeDateToPassTest.toUTCString()
        currentUnix = date
      }
      res.json({ unix: currentUnix, utc: currentDate })
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

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" })
})

// listen for requests :)
var listener = app.listen(process.env.PORT || 8000, function () {
  console.log("Your app is listening on port " + listener.address().port)
})
