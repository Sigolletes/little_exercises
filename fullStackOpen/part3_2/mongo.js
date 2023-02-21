/* // PRACTICE APPLICATION - node mongo.js password

// LIBRARY MONGOOSE (high-level API) IS AN ODM (Object Document Mapper) for saving JS objects as Mongo documents
const mongoose = require('mongoose')

// CONDITION FOR THE PASSWORD
if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

// ACCESS COMMAND LINE PARAMETER FOR GET THE PASSWORD
const password = process.argv[2]

// MongoDB URI
const url =
  `mongodb+srv://Aname:${password}@cluster0.md7ambl.mongodb.net/noteApp?retryWrites=true&w=majority`

// CONNECTION TO MongoDB
mongoose.set('strictQuery',false)
mongoose.connect(url)

// DEFINE THE SCHEMA FOR THE NOTE (tells Mongoose how the note objects are to be stored in the database) AND THE MATCHING MODEL
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

// Note MODEL DEFINITION (The name of the collection will be the lowercase plural notes) (Models are so-called constructor functions that create new JavaScript objects based on the provided parameters)
const Note = mongoose.model('Note', noteSchema)

// CREATE A NEW NOTE OBJECT WITH THE HELP OF Note MODEL
const note = new Note({
  content: 'HTML is Easy',
  important: true,
})

// // SAVE THE OBJECT TO THE DATABASE
// note.save().then(result => {
//   console.log('note saved!', result)
//   mongoose.connection.close() // (If the connection is not closed, the program will never finish its execution)
// })

// // CREATE AND SAVE SEVERAL NOTES
// let notesArray = [
//   {
//     content: 'TEST 1',
//     important: true,
//   },
//   {
//     content: 'TEST 2',
//     important: false,
//   },
//   {
//     content: 'TEST 3',
//     important: true,
//   }
// ]

// let manyNotes = function(notesArray) {
//   Note.create(notesArray, (error, docs) => {
//     if (error) {
//       console.log(error)
//       mongoose.connection.close()
//     } else {
//       console.log(docs)
//       mongoose.connection.close()
//     }
//   })
// }
// manyNotes(notesArray)

// // PRINT ALL THE NOTES STORED IN THE DATABASE
// Note.find({}).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })

// PRINT THE IMPORTANT NOTES STORED IN THE DATABASE
Note.find({ important: true }).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
}) */
