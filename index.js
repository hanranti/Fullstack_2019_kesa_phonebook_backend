require('dotenv').config()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const Person = require("./models/person")

morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})

app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))
app.use(cors())

app.get('/api/persons', (req, res) => {
    Person.find({})
        .then(persons => {
            res.status(200).send(persons)
        })
        .catch(error => {
            res.status(500).send({ error })
        })
})

app.get('/api/persons/:id', (req, res) => {
    const id = String(req.params.id)
    Person.findOne({ _id: id })
        .then(personById => {
            personById
                ? res.status(200).send(personById)
                : res.status(404).send({ error: "not found" })
        })
        .catch(error => {
            res.status(500).send({ error })
        })
})

app.post('/api/persons', (req, res) => {
    const newPerson = new Person({
        name: req.body.name,
        number: req.body.number
    })

    Person.find({ name: newPerson.name })
        .then(matchedPersons => {
            if (!newPerson.name || !newPerson.number) {
                res.status(400).send({ error: "name or number missing" })
            } else if (matchedPersons.length > 0) {
                res.status(400).send({ error: "name is already in the phonebook" })
            } else {
                newPerson.save().then(response => {
                    res.status(201).send(newPerson)
                })
            }
        })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = String(req.params.id)
    Person.findOneAndDelete({ _id: id })
        .then(result => {
            res.status(204).send({ result: result })
        })
        .catch(error => {
            res.status(404).send({ error })
        })
})

app.get('/info', (req, res) => {
    var currentTime = new Date()
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${currentTime}</p>`)
})

// const port = process.env.PORT
// app.listen(port)
app.listen(3001)