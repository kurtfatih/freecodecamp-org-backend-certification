const express = require("express")
const {
  getRequestHeaderParserIndexHtml,
  getWhoAmI
} = require("../../controllers/requestHeaderParserController")

// services api endpoints

const requestHeaderParserRoutes = express.Router()

requestHeaderParserRoutes.get("/", getRequestHeaderParserIndexHtml)
requestHeaderParserRoutes.get("/whoami", getWhoAmI)

module.exports = { requestHeaderParserRoutes }
