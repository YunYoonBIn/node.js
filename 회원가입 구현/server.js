const express = require('express');
const app = express();
const port = 8080;
const mysql = require('mysql');
const path = require('path');
const session = require('express-session');
const crypto = require('crypto');
const FileStore = require('session-file-store')(session);
const cookieParser = require('cookie-parser');

const db = mysql.createConnection({
    user: 'root',
    password: 'dbqls0417!#',
    database: 'dbs',
    host: 'localhost'
})

db.connect();


app.listen(port, () => console.log(`Example app listening on port ${port}!`))


