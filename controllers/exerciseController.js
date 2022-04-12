const Users = require("../model/exercise-tracker/Users")
const Exercise = require("../model/exercise-tracker/Exercise")
const path = require("path")

const getExerciseTrackerIndexHtml = (_, res) => {
  // console.log()
  res.sendFile(path.join(__dirname, "../views/exercise-tracker/index.html"))
}

const getUsers = async (_, res) => {
  console.log("yo")
  try {
    const data = await Users.find()
    return res.send(data)
  } catch (e) {
    return res.status(500).send(`${e.name}: ${e.message}`)
  }
}

const createUser = async (req, res) => {
  const { username } = req.body
  try {
    const data = await Users.create({ username })
    return res.json({ username: data.username, _id: data._id })
  } catch (e) {
    return res.status(500).send(`${e.name}: ${e.message}`)
  }
}

const createExerciseForUser = async function (req, res) {
  const { _id } = req.params
  const description = req.body.description
  const duration = req.body.duration
  const isDateValid = req.date.isDateValid
  if (!isDateValid) {
    return res.send("Date format is not valid yyyy/mm/dd")
  }
  const date = req.date.value

  try {
    const userData = await Users.findById(_id)

    const createdExerciseData = await Exercise.create({
      userId: _id,
      description,
      username: userData.username,
      duration,
      date
    })

    return res.json({
      _id: createdExerciseData.userId,
      username: userData.username,
      date: createdExerciseData.date,
      duration: createdExerciseData.duration,
      description: createdExerciseData.description
    })
  } catch (e) {
    return res.send(e)
  }
}

const getUserLogs = async (req, res) => {
  const { _id } = req.params
  const { limit, from, to } = req.query
  try {
    const userData = await Users.findById(_id)
    if (!userData) {
      return res.send("[object Object]")
    }

    const exerciseData = await Exercise.find({ userId: _id })
      .select(["-_id", "-userId"])
      .select("-__v")

    let exerciseDataLog = exerciseData
    if (from || to) {
      let fromDate = new Date(0)
      let toDate = new Date()
      if (from) {
        fromDate = new Date(from)
      }

      if (to) {
        toDate = new Date(to)
      }
      fromDate = fromDate.getTime()
      toDate = toDate.getTime()
      exerciseDataLog = exerciseData.filter(({ date }) => {
        let logDate = new Date(date).getTime()
        return logDate >= fromDate && logDate <= toDate
      })
    }

    if (limit) {
      exerciseDataLog = exerciseDataLog.slice(0, limit)
    }
    const responseObj = {
      _id,
      username: userData.username,
      count: exerciseDataLog.length,
      log: exerciseDataLog
    }
    return res.json(responseObj)
  } catch (e) {
    return res.status(500).send(`${e.name}: ${e.message}`)
  }
}

module.exports = {
  getExerciseTrackerIndexHtml,
  getUserLogs,
  getUsers,
  createUser,
  createExerciseForUser
}
