const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));

var db;

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb+srv://yubiny289:dbqls0417@cluster0.dsbtf.mongodb.net/TodoApp?retryWrites=true&w=majority', (err, client) => {
    if (err) return console.log(err);

    db = client.db('TodoApp');

    app.listen(port, () => {
        console.log('listening on 8080')
    });
})


app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get('/write', (req, res) => {
    res.sendFile(__dirname + "/write.html");
});

app.post('/newpost', (req, res) => {
    res.send("전송완료")
    console.log(req.body.title);
    console.log(req.body.date);
    db.collection('post').insertOne({ 제목: req.body.title, 날짜: req.body.date }, (err, 결과) => {
        console.log('데이터 저장완료')
    });
})
