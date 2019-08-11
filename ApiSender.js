require('dotenv').config()
//.env file exists for configuration of environment variables
const express = require('express');
const utf8 = require('utf8');
const app = express()
//use express on nodejs
const port = process.env.WEB_PORT;
//variable value not given directly but from a env variable source

var mysql = require('mysql')
var config = {
    host        : process.env.HOST,
    user        : process.env.DATABASE_USER,
    password    : process.env.PASSWORD,
    database    : process.env.DATABASE,
    port        : process.env.DATABASE_PORT
}
var connection = mysql.createConnection({
    host        : process.env.HOST,
    user        : process.env.DATABASE_USER,
    password    : process.env.PASSWORD,
    database    : process.env.DATABASE,
    port        : process.env.DATABASE_PORT
}
);

var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json())

const createConn = function(){
    connection.connect(function(error){
        if(error){
            console.log('connecting error: <span class="subst">${error}</span>');
            setTimeout(function(){
                connection = mysql.createConnection(config)
                createConn();
            },2000);
        }
    });
    connection.on('error', (error)=>{
        if(error.code == 'PROTOCOL_CONNECTION_LOST'){
            return createConn();
        }
        throw error;
    });
}

createConn();

app.get('/:levelid', function(req,res){
    connection.query("SELECT * FROM levels WHERE id = " + req.params.levelid, function(err, result){
        console.log(req.params.levelid)
        res.send(result);
    })
})

app.get('/', (req,res)=>{
    console.log(req.body.id)
    connection.query("SELECT * FROM levels", function(err,fields){
        if(!err){
            res.send(fields);
        }
    })
})

app.post('/',function(req,res){
    connection.query("INSERT INTO `levels` (name, imageurl, leveltext, highscore) VALUES('" + req.body.name + "', '" + req.body.imageurl + "','" + req.body.leveltext + "', '" + req.body.highscore +"' )")
    res.json({
        id : req.body.id,
        name : req.body.name
    })
    console.log(req.body);
})

app.put('/:levelid', function(req,res){
    connection.query("UPDATE `levels` SET `highscore` = '" + req.body.highscore + "' WHERE `id` = '" + req.params.levelid + "';", function(err, result){
        res.send(result);
    })
})

