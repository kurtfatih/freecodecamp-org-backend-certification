const express = require("express")
const { exerciseTrackerRoutes } = require("./exercise")
const apiRoutes = express.Router()

apiRoutes.use("/exercise-tracker", exerciseTrackerRoutes)

module.exports = apiRoutes
