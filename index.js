const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes/routes');

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const dotenv = require('dotenv');
dotenv.config();

app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})

app.use(routes);

app.listen(process.env.PORT || 8080)

