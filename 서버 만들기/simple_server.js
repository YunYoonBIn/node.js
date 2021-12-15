const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/home', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get('/home/write', (req, res) => {
    res.sendFile(__dirname + "/write.html");
});

app.post('/newpost', (req, res) => {
    res.send("전송완료")
    console.log(req.body.title);
    console.log(req.body.date);
})

app.listen(port, () => {
    console.log('8080포트에서 서버 실행중')
});