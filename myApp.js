require("dotenv").config()
const { Schema } = require("mongoose")
const mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const personSchema = new Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String]
})

let Person = mongoose.model("Person", personSchema)
let person = new Person({
  name: "Fatih",
  age: 18,
  favoriteFoods: ["hamburger"]
})

const createAndSavePerson = async (done) => {
  const data = await person.save()
  done(null, data)
}

const createManyPeople = async (arrayOfPeople, done) => {
  const data = await Person.create(arrayOfPeople)
  done(null, data)
}

const findPeopleByName = async (personName, done) => {
  const data = await Person.find({ name: personName }).exec()
  done(null, data)
}

const findOneByFood = async (food, done) => {
  const data = await Person.findOne({ favoriteFoods: food }).exec()
  done(null, data)
}

const findPersonById = async (personId, done) => {
  const data = await Person.findById(personId).exec()
  done(null, data)
}

const findEditThenSave = async (personId, done) => {
  const foodToAdd = "hamburger"
  const person = await Person.findById(personId).exec()
  person.favoriteFoods.push(foodToAdd)
  const data = await person.save()
  done(null, data)
}

const findAndUpdate = async (personName, done) => {
  const ageToSet = 20
  const data = await Person.findOneAndUpdate(
    { name: personName },
    { age: ageToSet },
    { new: true }
  )
  done(null, data)
}

const removeById = async (personId, done) => {
  const data = await Person.findByIdAndRemove(personId)

  done(null, data)
}

const removeManyPeople = (done) => {
  const nameToRemove = "Mary"

  done(null /*, data*/)
}

const queryChain = (done) => {
  const foodToSearch = "burrito"

  done(null /*, data*/)
}

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person
exports.createAndSavePerson = createAndSavePerson
exports.findPeopleByName = findPeopleByName
exports.findOneByFood = findOneByFood
exports.findPersonById = findPersonById
exports.findEditThenSave = findEditThenSave
exports.findAndUpdate = findAndUpdate
exports.createManyPeople = createManyPeople
exports.removeById = removeById
exports.removeManyPeople = removeManyPeople
exports.queryChain = queryChain
