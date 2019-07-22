require('dotenv').config()
//.env file exists for configuration of environment variables
const express = require('express');
const app = express()
//use express on nodejs
const port = process.env.WEB_PORT;
//variable value not given directly but from a env variable source

var mysql = require('mysql')
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

connection.connect()

app.get('/:levelid', function(req,res){
    connection.query("SELECT * FROM levels WHERE id = " + req.params.levelid, function(err, result){
        console.log(req.params.levelid)
        res.send(result)
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
    //var levelname=req.body.name
    connection.query("INSERT INTO `levels` (id, name, imageurl, leveltext, highscore) VALUES('" + req.body.id + "', '" + req.body.name + "', '" + req.body.imageurl + "','" + req.body.leveltext + "', '" + req.body.highscore +"' )")

    res.json({
        id : req.body.id,
        name : req.body.name
    })
})

app.listen(port, ()=> console.log(`Example app listening on port ${port}!`))