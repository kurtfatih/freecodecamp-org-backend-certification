const express = require("express")
const bodyParser = require("body-parser")
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const {
  getUrlShortenerIndexHtml,
  getShortUrl,
  findOrCreateShortenerUrl
} = require("../../controllers/urlShortenerController")

const urlShortenerRoutes = express.Router()

urlShortenerRoutes.use(express.static("public"))
urlShortenerRoutes.use("/shorturl", urlencodedParser)

urlShortenerRoutes.get("/", getUrlShortenerIndexHtml)
urlShortenerRoutes.post("/shorturl", findOrCreateShortenerUrl)
urlShortenerRoutes.get("/shorturl/:shortCode", getShortUrl)

module.exports = { urlShortenerRoutes }
