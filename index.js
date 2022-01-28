const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const pug = require('pug')
const mongoose = require('mongoose')
const foundusers = require('./user_model.js')
const dbEntry = require('./user_model.js')
require('dotenv').config()

const port = 5000
const uri = process.env.MONGO_STRING
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB Connected')
  })
  .catch(err => console.log(err))

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use('/public', express.static(path.join(__dirname, 'public')))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', async function (req, res, next) {
  res.render('index')
})

app.get('/example', async function (req, res, next) {
  res.render('example')
})

app.get('/create', async function (req, res, next) {
  res.render('create', {})
})

function makeid (length) {
  const result = []
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(Math.random() *
charactersLength)))
  }
  return result.join('')
}

app.post('/create', async function (req, res, next) {
  console.log(req.body.name)
  console.log(req.body.sex)
  console.log(req.body.borndate)
  console.log(req.body.address)
  console.log(req.body.number)
  console.log(req.body.enumber)
  console.log(req.body.bloodtype)
  console.log(req.body.extratext)
  console.log(req.body.previousillness)

  const randomstring = makeid(5)
  const generated_passcode = makeid(5)

  // validation

  dbEntry.create({
    passcode: generated_passcode,
    uid: randomstring,
    name: req.body.name,
    sex: req.body.sex,
    borndate: req.body.borndate,
    address: req.body.address,
    number: req.body.number,
    enumber: req.body.enumber,
    bloodtype: req.body.bloodtype,
    extratext: req.body.extratext,
    previousillness: req.body.previousillness,
    bloodtype: req.body.bloodtype
  }); console.log('Successful creation of new entry')

  // save info into db

  res.redirect('/i/' + randomstring + '/' + generated_passcode)
})

app.get('/i/:id/:passcode', async function (req, res) {
  console.log(req.params.id)
  console.log(req.params.passcode)

  // get info by id and pass to pug
  const query = await dbEntry.findOne({ uid: req.params.id }).exec()
  console.log(query)

  if (req.params.passcode == query.passcode) {
    res.render('created', {
      id: query.uid,
      passcode: query.passcode,
      name: query.name,
      sex: query.sex,
      borndate: query.borndate,
      address: query.address,
      number: query.number,
      enumber: query.enumber,
      bloodtype: query.bloodtype,
      extratext: query.extratext,
      previousillness: query.previousillness,
      bloodtype: query.bloodtype
    })
  } else {
    res.send('wrong passcode or invalid link')
  }
})

app.listen(process.env.PORT || 5000, () => {
  console.log(`App listening at http://localhost:${port}`)
})
