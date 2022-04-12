const multer = require("multer")
const upload = multer({ dest: "filemetadata/uploads/" })
const uploadSingleFileMiddleWare = upload.single("upfile")
module.exports = uploadSingleFileMiddleWare
