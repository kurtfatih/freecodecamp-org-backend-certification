const express = require("express")
const { exerciseTrackerRoutes } = require("./exercise")
const { fileMetaDataRoutes } = require("./filemetadata")
const {
  requestHeaderParserRoutes
} = require("./request-header-parser-microservice")
const { timestampMicroServiceRouter } = require("./timestamp-microservice")
const { urlShortenerRoutes } = require("./url-shortener")

const apiRoutes = express.Router()

apiRoutes.use("/exercise-tracker", exerciseTrackerRoutes)
apiRoutes.use("/file-metadata-microservice", fileMetaDataRoutes)
apiRoutes.use("/timestamp-microservice", timestampMicroServiceRouter)
apiRoutes.use("/urlshortener", urlShortenerRoutes)
apiRoutes.use("/request-header-parser-microservice", requestHeaderParserRoutes)
apiRoutes.get("/", (_, res) =>
  res.send(
    '<p><a href="/api/exercise-tracker">Exercise Tracker</a></p><p><a href="/api/file-metadata-microservice">File Metadata Microservice</a></p><p><a href="/api/timestamp-microservice">Timestamp Microservice</a></p><p><a href="/api/urlshortener">Url Shortener</a></p><p><a href="/api/request-header-parser-microservice">Request Header Parser Microservice</a></p>'
  )
)

module.exports = apiRoutes
