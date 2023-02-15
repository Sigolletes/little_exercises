// EXPRESS FRAMEWORK FOR NODE.JS
const express = require('express')
const app = express()

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
