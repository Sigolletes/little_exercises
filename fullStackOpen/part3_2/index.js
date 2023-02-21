// DOTENV
require('dotenv').config()

// EXPRESS FRAMEWORK FOR NODE.JS
const express = require('express')
const app = express()

// ##################### MONGOOSE ################################

// LIBRARY MONGOOSE (high-level API) IS AN ODM (Object Document Mapper) for saving JS objects as Mongo documents
const mongoose = require('mongoose')

// MongoDB URI
const url =
  `mongodb+srv://Aname:${process.env.PASSWORD}@cluster0.md7ambl.mongodb.net/noteApp?retryWrites=true&w=majority`

  // CONNECTION TO MongoDB
mongoose.set('strictQuery',false)
mongoose.connect(url)

// DEFINE THE SCHEMA FOR THE NOTE (tells Mongoose how the note objects are to be stored in the database) AND THE MATCHING MODEL
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

// FORMAT THE OBJECTS RETURNED BY MONGOOSE
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Note MODEL DEFINITION (The name of the collection will be the lowercase plural notes) (Models are so-called constructor functions that create new JavaScript objects based on the provided parameters)
const Note = mongoose.model('Note', noteSchema)

// HANDLER FOR FETCHING ALL NOTES 
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

// ##################### MONGOOSE ################################

// MIDDLEWARE CORS (Cross-Origin Resource Sharing) FOR ALLOW CROSS-ORIGIN REQUESTS
const cors = require('cors')
app.use(cors())

// EXPRESS JSON-PARSER FOR ACCESS DATA EASILY (creates body property)
app.use(express.json())

// OUR OWN MIDDLEWARE THAT PRINTS INFORMATION ABAUT EVERY REQUEST THAT IS SENT TO THE SERVER (it has to be before routes)
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

// MIDDLEWARE STATIC FROM EXPRESS FOR SHOW INDEX.HTML FROM BUILD FOLDER IF THE GET REQUEST ADDRESS CORRESPOND TO www.example.com/index.html OR www.example.com
app.use(express.static('build'))

// NOTES ARRAY
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

// RESPONSES TO THE REQUESTS (ROUTES)
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)
  response.json(note)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

// MIDDLEWARE FOR CATCHING REQUESTS MADE TO NON-EXISTENT ROUTES (it has to be after routes)
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// THE WEB SERVER CREATED WITH EXPRESS (APP) IS ASSIGNED TO A PORT AND RESPOND TO THE REQUESTS OF THAT PORT
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
