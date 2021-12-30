// 미들웨어 설정

const express = require('express');
const app = express();
const port = 8080;
const mysql = require('mysql');
const path = require('path');
const session = require('express-session');
const crypto = require('crypto');
const FileStore = require('session-file-store')(session);
const cookieParser = require('cookie-parser');

app.use(session({
    secret: 'blackzat',
    resave: false,
    saveUninitialized: true,
    stoer: new FileStore,
}))
app.use(express.static(path.join(__dirname, "/public")));
app.set('views', __dirname + '\\views');
app.set('view engine', 'ejs')


const db = mysql.createConnection({
    user: 'root',
    password: 'dbqls0417!#',
    database: 'dbs',
    host: 'localhost'
})

db.connect();

// 메인페이지

// 아래와와 같이 만약 세선에 로그인이 되었다면 세션 값들을 보내서
// 인식하게 처리를 함, 하지만 아니라면 그냥 화면을 출력하게 만듦.

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

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


