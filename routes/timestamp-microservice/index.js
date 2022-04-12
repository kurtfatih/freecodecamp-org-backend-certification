const express = require("express")
const {
  getTimestampIndexHtml,
  getTimestamp
} = require("../../controllers/timestampMicroServiceController")

const timestampMicroServiceRouter = express.Router()

timestampMicroServiceRouter.get("/", getTimestampIndexHtml)
timestampMicroServiceRouter.get("/api/:date?", getTimestamp)

module.exports = { timestampMicroServiceRouter }
