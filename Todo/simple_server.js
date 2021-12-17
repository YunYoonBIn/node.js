const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 8080;
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express)

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
    res.render("index.ejs");
});

app.get('/write', (req, res) => {
    res.render("write.ejs");
});


app.get('/list', (req, res) => {
    db.collection('post').find().toArray((err, client) => {
        if (err) return console.log(err);

        console.log(client)
        res.render('list.ejs', { posts: client })
    });

})

app.post('/newpost', (req, res) => {
    res.send("전송완료")
    console.log(req.body.title);
    console.log(req.body.date);
    db.collection('post').insertOne({ 제목: req.body.title, 날짜: req.body.date }, (err, 결과) => {
        console.log('데이터 저장완료')
    });
})