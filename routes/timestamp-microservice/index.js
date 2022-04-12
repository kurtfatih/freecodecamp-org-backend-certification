const express = require("express")
const {
  getTimestampIndexHtml,
  getTimestamp
} = require("../../controllers/timestampMicroServiceController")

const timestampMicroServiceRouter = express.Router()

timestampMicroServiceRouter.use(express.static("public"))

timestampMicroServiceRouter.get("/", getTimestampIndexHtml)
timestampMicroServiceRouter.get("/:date?", getTimestamp)

module.exports = { timestampMicroServiceRouter }
