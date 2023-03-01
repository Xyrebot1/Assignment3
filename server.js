'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host : "mysql1",
    user : "root",
    password : "admin"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to MYSQL Server!");
});

app.get('/init', (req, res) => {
    connection.query(`CREATE DATABASE postdb`, function (error,results) {
        if (error) console.log(error);
    });

    connection.query(`USE postdb`, function(error,results) {
        if (error) console.log(error);
    });

    connection.query(`CREATE TABLE posts 
    ( id int unsigned NOT NULL auto_increment,
    topic varchar(100) NOT NULL,
    data varchar(100) NOT NULL,
    PRIMARY KEY (id))`, function (error,results) {
        if (error) console.log(error);
    });
    res.send('Database and Table created!');
});

app.post('/addPost', (req, res) => {
    var topic = req.body.topic;
    var data = req.body.data;
    var query = `INSERT INTO posts (topic, data) VALUES
    ("${topic}", "${data}")`;
    connection.query(query, function (error, results) {
        if (error) console.log(error);
        res.send('New Post inserted');
    });
});

app.get('/getPosts', (req, res) => {
    const sqlQuery = 'SELECT * FROM posts';
    connection.query(sqlQuery, function (error, results) {
        if (error) console.log(error);
        res.json({ 'allPosts': results});
    });
});

app.use('/', express.static('pages'));

app.listen(PORT, HOST);
console.log('up and running');