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

// const exerciseMicroServiceUrl = "/exercise-tracker"
// const exerciseMicroServiceUserEndPoint =
//   exerciseMicroServiceUrl + apiBaseUri + "/users"
// const exerciseMicroServiceExerciseEndPoint =
//   exerciseMicroServiceUserEndPoint + "/:_id" + "/exercises"
// const exerciseMicroServiceLogEndPoint =
//   exerciseMicroServiceUserEndPoint + "/:_id/" + "logs"

const exerciseTrackerRoutes = express.Router()

exerciseTrackerRoutes.use(express.static("public"))

exerciseTrackerRoutes.use("/users", urlencodedParser)
exerciseTrackerRoutes.use("/users/:id/exercises", [
  urlencodedParser,
  exerciseTrackerMiddleWare
])

exerciseTrackerRoutes.get("/", getExerciseTrackerIndexHtml)
exerciseTrackerRoutes.get("/users", getUsers)
exerciseTrackerRoutes.post("/users", createUser)
exerciseTrackerRoutes.get("/users/:_id/logs", getUserLogs)
exerciseTrackerRoutes.post("/users/:_id/exercises", createExerciseForUser)

module.exports = { exerciseTrackerRoutes }
