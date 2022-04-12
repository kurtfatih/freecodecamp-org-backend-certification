const path = require("path")

const getRequestHeaderParserIndexHtml = (_, res) => {
  res.sendFile(
    path.join(__dirname, "../views/request-header-parser/index.html")
  )
}
const getWhoAmI = (req, res) => {
  const software = req.headers["user-agent"]
  const language = req.headers["accept-language"]
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress

  res.json({ ipaddress: ipAddress, language, software })
}

module.exports = { getRequestHeaderParserIndexHtml, getWhoAmI }
