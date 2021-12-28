const { Router } = require('express');
const express = require('express')
const app = express()
const port = 8080

app.use(express.json());

app.post('/register', (req, res, next) => {
    console.log(res.body)
    res.end()
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

