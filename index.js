const express = require('express')
const app = express()
const bodyParser = require('body-parser')
let morgan = require('morgan')

morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})

app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    },
    {
        "name": "dsajdjasdas",
        "number": "11111",
        "id": 5
    }
]

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const personById = persons.find(person => person.id === id)
    typeof personById !== 'undefined'
        ? res.status(200).send(persons.find(person => person.id === id))
        : res.status(404).send({ error: "not found" })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const personById = persons.find(person => person.id === id)
    if (typeof personById !== 'undefined') {
        persons = persons.filter(person => person.id !== id)
        res.status(204).send()
    } else {
        res.status(404).send({ error: "not found" })
    }
})

app.get('/api/persons', (req, res) => {
    res.status(200).send(persons)
})

app.post('/api/persons', (req, res) => {
    const newPerson = {
        name: req.body.name,
        number: req.body.number,
        id: Math.floor(Math.random() * 10000)
    }
    if (typeof newPerson.name === 'undefined' || typeof newPerson.number === 'undefined') {
        res.status(400).send({ error: "name or number missing" })
    } else if (persons.filter(person => person.name === newPerson.name).length > 0) {
        res.status(400).send({ error: "name is already in the phonebook" })
    } else {
        persons.push(newPerson)
        res.status(201).send(newPerson)
    }
})

app.get('/info', (req, res) => {
    var currentTime = new Date()
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${currentTime}</p>`)
})

const port = 3001
app.listen(port)