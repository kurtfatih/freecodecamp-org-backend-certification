const express = require("express")
const { exerciseTrackerRoutes } = require("./exercise")
const { fileMetaDataRoutes } = require("./filemetadata")
const { timestampMicroServiceRouter } = require("./timestamp-microservice")

const apiRoutes = express.Router()

apiRoutes.use("/exercise-tracker", exerciseTrackerRoutes)
apiRoutes.use("/file-metadata-microservice", fileMetaDataRoutes)
apiRoutes.use("/timestamp-microservice", timestampMicroServiceRouter)

module.exports = apiRoutes
