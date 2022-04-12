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

// services api endpoints

const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(cors({ optionsSuccessStatus: 200 })) // some legacy browsers choke on 204
// http://expressjs.com/en/starter/static-files.html
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

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" })
})

// listen for requests :)
var listener = app.listen(process.env.PORT || 8000, function () {
  console.log("Your app is listening on port " + listener.address().port)
})

//utils
