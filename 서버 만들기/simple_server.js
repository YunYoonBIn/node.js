const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log('8080포트에서 서버 실행중')
});