const isValidDate = require("../utils/isValidDate")

const exerciseTrackerMiddleWare = (req, _, next) => {
  const date = req.body.date
  if (date) {
    const isDateValid = isValidDate(date)
    const dateValue = isDateValid
      ? new Date(date).toDateString()
      : new Date().toDateString()

    req.date = { isDateValid, value: dateValue }
    return next()
  }

  req.date = { isDateValid: true, value: new Date().toDateString() }
  return next()
}
module.exports = exerciseTrackerMiddleWare
