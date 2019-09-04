const mongoose = require("mongoose")

const url1 = "mongodb+srv://first_user:"
const url2 = "@cluster0-4i4rg.mongodb.net/phonebook?retryWrites=true&w=majority"

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

const addPerson = ({ person }) => {
    const newPerson = new Person({
        name: name,
        number: number
    })

    newPerson.save().then(response => {
        mongoose.connection.close()
    })
}

const logAllPersons = () => {
    Person.find({}).then(persons => {
        persons.map(person => {
            console.log(person.name + " " + person.number)
        })
        mongoose.connection.close()
    })
}

mongoose.connect(url1 + process.argv[2] + url2, { useNewUrlParser: true })

if (process.argv.length === 3) {
    logAllPersons()
} else if (process.argv.length === 5) {
    addPerson(name = process.argv[3], number = process.argv[4])
    console.log("added " + process.argv[3] + " number " + process.argv[4] + " to phonebook")
} else {
    console.log("Wrong number of arguments!")
}