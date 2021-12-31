// 미들웨어 설정

const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql');
const path = require('path');
const session = require('express-session');
const crypto = require('crypto');
const FileStore = require('session-file-store')(session);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, "/public")));
app.set('views', __dirname + '\\views');
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: 'yunyubin',
    resave: false,
    saveUninitialized: true,
    stoer: new FileStore,
}))

const db = mysql.createConnection({
    user: 'root',
    password: 'dbqls0417!#',
    database: 'dbs',
    host: 'localhost'
})

db.connect();

/* 메인 페이지

 아래와 같이 만약 세선에 로그인이 되었다면 세션 값들을 보내서
 인식하게 처리를 함, 하지만 아니라면 그냥 화면을 출력하게 만듦.
 */

app.get('/', (req, res) => {
    console.log('메인페이지');
    console.log(req.session);
    if (req.session.is_logined == true) {
        res.render('main.ejs', {
            is_logined: req.session.is_logined,
            name: req.session.name
        });
    } else {
        res.render('main.ejs', {
            is_logined: false
        });
    }
});

/* 회원가입 페이지

아래와 같이 회원가입을 눌렀을 시 get으로 파일을 띄우고
만약 회원가입창에서 회원가입을 하면
post로 보내기에 post로 받아서
회원가입창에 입력한 정보부터 다 가져온다.

그리고 mysql에 접속을 한 뒤 그 데이터 값(길이로 판단)이 없으면
회원가입을 시켜 데이터베이스에 저장한다.
만약 있으면 실패로 하고 다시 돌아온다.
 */

app.get('/register', (req, res) => {
    console.log('회원가입 페이지')
    res.render('register.ejs')
})

app.post('/register', (req, res) => {
    console.log('회원가입 하는중')
    const body = req.body;
    const id = body.id;
    const pw = body.pw;
    const name = body.name;
    const ago = body.ago;
    const email = body.email;

    db.query('select * from userdata where id=?', [id], (err, data) => {

        if (data.length == 0) {
            console.log('회원가입 성공')
            db.query('insert into userdata(id, pw, name, ago, email) value(?,?,?,?,?)', [
                id, pw, name, ago, email
            ]);
            res.redirect('/')
        } else {
            console.log('회원가입 실패')
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            });
            res.write("<script>alert('회원가입 실패')</script>");
            res.write('<script>location.href = "/"</script>');
        }
    })
})

app.get('/login', (req, res) => {
    console.log('로그인 작동');
    res.render('login');
});

app.post('/login', (req, res) => {
    const body = req.body;
    const id = body.id;
    const pw = body.pw;

    db.query('select * from userdata where id=?', [id], (err, data) => {
        if (id == data[0].id || pw == data[0].pw) {
            console.log('로그인 성공');

            req.session.is_logined = true;
            req.session.name = data.name;
            req.session.id = data.id;
            req.session.pw = data.pw;

            req.session.save(function () {
                res.render('main.ejs', {
                    name: data[0].name,
                    is_logined: true
                });
            });
        } else {
            console.log('로그인 실패');
            res.render('login.ejs');
        }
    });
});

app.get('/logout', (req, res) => {
    console.log('로그아웃 성공')
    req.session.destroy(function (err) {
        res.redirect('/')
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


