const express = require('express')
const app = express()

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
    }
]

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const personById = persons.find(person => person.id === id)
    typeof personById !== 'undefined'
        ? res.send(JSON.stringify(persons.find(person => person.id === id)))
        : res.status(404).send('404')
})

app.get('/api/persons', (req, res) => {
    res.send(JSON.stringify(persons))
})

app.get('/info', (req, res) => {
    var currentTime = new Date()
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${currentTime}</p>`)
})

const port = 3001
app.listen(port)