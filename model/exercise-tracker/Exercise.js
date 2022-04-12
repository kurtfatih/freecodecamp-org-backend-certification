const mongoose = require("mongoose")

const Exercise = mongoose.model("Exercises", {
  userId: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: String, required: false }
})

module.exports = Exercise
