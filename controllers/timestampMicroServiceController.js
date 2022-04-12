const path = require("path")

const getTimestampIndexHtml = function (_, res) {
  res.sendFile(path.join(__dirname, "../views/timestamp/index.html"))
}

const getTimestamp = (req, res) => {
  const { date } = req.params
  // date is string
  let currentDate
  let currentUnix
  const isTheInputString = isNaN(date)
  const isValidDateOrTimestamp = isTheInputString
    ? new Date(date).getTime() > 0
    : new Date(Number(date)).getTime() > 0

  if (date) {
    if (isValidDateOrTimestamp) {
      currentDate = new Date(date).toUTCString()
      currentUnix = new Date(date).valueOf()
      if (!isTheInputString) {
        // that means input is unix format
        const convertedUnixToDate = new Date(Number(date))
        currentDate = convertedUnixToDate.toUTCString()
        currentUnix = date
      }
      res.json({ unix: Number(currentUnix), utc: currentDate })
    } else {
      res.json({ error: "Invalid Date" })
    }
  } else {
    const date = new Date()
    const unitFormat = date.valueOf()
    const utcString = date.toUTCString()
    res.json({ unix: unitFormat, utc: utcString })
  }
}

module.exports = { getTimestampIndexHtml, getTimestamp }
