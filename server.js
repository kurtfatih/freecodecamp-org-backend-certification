require("dotenv").config()
const mongoose = require("mongoose")
const path = require("path")
const cors = require("cors")
const express = require("express")

const apiRoutes = require("./routes")

const app = express()

app.use(cors({ optionsSuccessStatus: 200 }))
app.use(express.static(path.join(__dirname, "public")))

app.use("/api", apiRoutes)

const main = () => {
  try {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    const listener = app.listen(process.env.PORT || 8000, function () {
      console.log("Your app is listening on port " + listener.address().port)
    })
  } catch (e) {
    console.log(e)
  }
}

main()
