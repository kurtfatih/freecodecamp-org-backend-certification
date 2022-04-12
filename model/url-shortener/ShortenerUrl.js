const mongoose = require("mongoose")

const ShortenerUrl = mongoose.model("ShortenerUrl", {
  url: { type: String },
  shortCode: { type: Number }
})
module.exports = ShortenerUrl
