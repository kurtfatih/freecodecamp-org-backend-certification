const express = require("express")
const bodyParser = require("body-parser")
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const {
  getUrlShortenerIndexHtml,
  getShortUrl,
  findOrCreateShortenerUrl
} = require("../../controllers/urlShortenerController")

const urlShortenerRoutes = express.Router()

urlShortenerRoutes.use("/api/shorturl", urlencodedParser)

urlShortenerRoutes.get("/", getUrlShortenerIndexHtml)
urlShortenerRoutes.post("/api/shorturl", findOrCreateShortenerUrl)
urlShortenerRoutes.get("/api/shorturl/:shortCode", getShortUrl)

module.exports = { urlShortenerRoutes }
