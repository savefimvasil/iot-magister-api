const express = require('express')
const cors = require('cors')
const router = require('./post.route')
const bodyParser = require('body-parser')

const app = express()
const PORT = process.env.PORT || 3002

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('dist'))
app.use('/', router)

app.listen(PORT, function () {
  console.log('Server is running on Port:', PORT)
})
