const express = require("express")
const bodyParser = require("body-parser")

const {
  createExerciseForUser,
  createUser,
  getUserLogs,
  getUsers,
  getExerciseTrackerIndexHtml
} = require("../../controllers/exerciseController")
const exerciseTrackerMiddleWare = require("../../middlewares/exercise-tracker-middlewares")

const urlencodedParser = bodyParser.urlencoded({ extended: false })

const exerciseTrackerRoutes = express.Router()

exerciseTrackerRoutes.use("/api/users", urlencodedParser)
exerciseTrackerRoutes.use("/api/users/:id/exercises", [
  urlencodedParser,
  exerciseTrackerMiddleWare
])

exerciseTrackerRoutes.get("/", getExerciseTrackerIndexHtml)
exerciseTrackerRoutes.get("/api/users", getUsers)
exerciseTrackerRoutes.post("/api/users", createUser)
exerciseTrackerRoutes.get("/api/users/:_id/logs", getUserLogs)
exerciseTrackerRoutes.post("/api/users/:_id/exercises", createExerciseForUser)

module.exports = { exerciseTrackerRoutes }
