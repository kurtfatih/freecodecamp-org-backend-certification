const path = require("path")

const getFileMetaDataRoutesIndexHtml = function (_, res) {
  res.sendFile(path.join(__dirname, "../views/filemetadata/index.html"))
}

const uploadSingleFile = function (req, res) {
  const file = req.file
  const resObj = {
    name: file.originalname,
    type: file.mimetype,
    size: file.size
  }
  return res.json(resObj)
}

module.exports = { getFileMetaDataRoutesIndexHtml, uploadSingleFile }
