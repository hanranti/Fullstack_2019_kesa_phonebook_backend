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

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    Person.find({ _id: id }).then(personById => {
        personById.length === 0
            ? res.status(200).send(personById)
            : res.status(404).send({ error: "not found" })
    })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = String(req.params.id)
    Person.find({ _id: id })
        .remove(response => {
            res.status(204).send()
            persons = persons.filter(person => person._id !== id)
        })
        .catch(error => res.status(404).send({ error: "not found" }))
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.status(200).send(persons)
    })
})

app.post('/api/persons', (req, res) => {
    const newPerson = new Person({
        name: req.body.name,
        number: req.body.number
    })

    if (typeof newPerson.name === 'undefined' || typeof newPerson.number === 'undefined') {
        res.status(400).send({ error: "name or number missing" })
    } else if (persons.filter(person => person.name === newPerson.name).length > 0) {
        res.status(400).send({ error: "name is already in the phonebook" })
    } else {
        newPerson.save().then(response => {
            res.status(201).send(newPerson)
        })
    }
})

app.get('/info', (req, res) => {
    var currentTime = new Date()
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${currentTime}</p>`)
})

// const port = process.env.PORT
// app.listen(port)
app.listen(3001)