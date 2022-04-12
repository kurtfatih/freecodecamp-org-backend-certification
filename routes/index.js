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

module.exports = apiRoutes
