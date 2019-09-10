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

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return res.status(400).send({ error: 'malformatted id' })
    } else {
        res.status(500).send({ error })
    }

    next(error)
}

app.use(errorHandler)

app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(persons => {
            res.status(200).send(persons)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = String(req.params.id)
    Person.findOne({ _id: id, name: req.body.name })
        .then(personById => {
            personById
                ? res.status(200).send(personById)
                : res.status(404).send({ error: "not found" })
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const id = String(req.params.id)
    Person.update({ _id: id }, { number: req.body.number })
        .then(personById => {
            personById
                ? res.status(200).send(personById)
                : res.status(404).send({ error: "not found" })
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
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
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = String(req.params.id)
    Person.findOneAndDelete({ _id: id })
        .then(result => {
            res.status(204).send({ result: result })
        })
        .catch(error => next(error))
})

app.get('/info', (req, res) => {
    var currentTime = new Date()
    Person.find({})
        .then(persons => {
            res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${currentTime}</p>`)
        })
        .catch(error => next(error))
})

// const port = process.env.PORT
// app.listen(port)
app.listen(3001)