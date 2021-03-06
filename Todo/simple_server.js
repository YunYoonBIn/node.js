const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 8080;
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express)
app.use('/public', express.static('public'));


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
    db.collection('counter').findOne({ name: '게시물갯수' }, (err, client) => {
        if (err) return console.log(err);
        var 총게시물갯수 = client.totalpost

        db.collection('post').insertOne({ _id: 총게시물갯수, 제목: req.body.title, 날짜: req.body.date }, (err, client) => {
            if (err) return console.log(err);
            console.log('데이터 저장완료');

            db.collection('counter').updateOne({ name: '게시물갯수' }, { $inc: { totalpost: 1 } }, (err, client) => {
                if (err) return console.log(err);
            })
        });
    });
});

app.delete('/delete', (req, res) => {
    console.log(req.body._id);
    req.body._id = parseInt(req.body._id);
    db.collection('post').deleteOne(req.body, (err, client) => {
        console.log('삭제완료');
        res.status(200).send({ message: "성공했습니다." });

    })
})

app.get('/detail/:id', (req, res) => {
    db.collection('post').findOne({ _id: parseInt(req.params.id) }, (err, client) => {

        if (client) {
            res.render('detail.ejs', { data: client })
        } else {
            console.log(err);
            res.send("요청하신 페이지는 없는 페이지 입니다.")
        }
    })
})

app.get('/edit/:id', (req, res) => {
    db.collection('post').findOne(parseInt({ _id: req.params.id }), (err, client) => {
        if (client) {
            res.render('edit.ejs', { post: client })
        } else {
            console.log(err)
            res.send('요청하신 페이지는 없는 페이지 입니다.')
        }
    })
})

app.put('/edit', (req, res) => {
    db.collection('post').updateOne({ _id: parseInt(req.body.id) }, { $set: { 제목: req.body.title, 날짜: req.body.date } }, (err, client) => {
        console.log("수정완료")
        res.redirect('/list')
    })
})