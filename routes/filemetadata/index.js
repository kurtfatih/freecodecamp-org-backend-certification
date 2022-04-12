const express = require("express")
const {
  getFileMetaDataRoutesIndexHtml,
  uploadSingleFile
} = require("../../controllers/fileMetaDataController")

const uploadSingleFileMiddleWare = require("../../middlewares/filemeta-data-middlewares")

const fileMetaDataRoutes = express.Router()

fileMetaDataRoutes.get("/", getFileMetaDataRoutesIndexHtml)

fileMetaDataRoutes.use("/api/fileanalyse", uploadSingleFileMiddleWare)

fileMetaDataRoutes.post("/api/fileanalyse", uploadSingleFile)

module.exports = { fileMetaDataRoutes }
