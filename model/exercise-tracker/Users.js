const mongoose = require("mongoose")

const Users = mongoose.model("Users", {
  username: { type: String, required: true }
})

module.exports = Users
