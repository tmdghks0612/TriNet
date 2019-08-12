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

var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json())

const createConn = function(){
    connection = mysql.createConnection(config)
    connection.connect(function(error){
        if(error){
            console.log('connection connect error!')
        }
    });
}

const destroyConn = function(){
    connection.end(function(error){
        if(error){
            console.log('connection ending error!')
        }
    })
}

createConn();

app.get('/:levelid', function(req,res){
    var connection = mysql.createConnection(config)
    connection.connect(function(error){
        if(error){
            console.log('connection connect lost during Get request!')
        }
        else{
            connection.query("SELECT * FROM levels WHERE id = " + req.params.levelid, function(err, result){
                console.log(req.params.levelid)
                res.send(result)
                connection.end(function(error){
                    if(error){
                        console.log('connection end lost during Get request!')
                    }
                })
            })
        }
    })
})

app.get('/', (req,res)=>{
    var connection = mysql.createConnection(config)
    connection.connect(function(error){
        if(error){
            console.log('connection connect lost during GetID request!')
        }
        else{
            console.log(req.body.id)
            connection.query("SELECT * FROM levels", function(err,fields){
                res.send(fields);
                connection.end(function(error){
                    if(error){
                        console.log('connection end lost during GetID request!')
                    }
                })
            })
        }
    })
})

app.post('/',function(req,res){
    //var levelname=req.body.name
    var connection = mysql.createConnection(config)
    connection.connect(function(error){
        if(error){
            console.log('connection connect lost during Post request!')
        }
        else{
            connection.query("INSERT INTO `levels` (name, imageurl, leveltext, highscore) VALUES('" + req.body.name + "', '" + req.body.imageurl + "','" + req.body.leveltext + "', '" + req.body.highscore +"' )", function(err,result){
                console.log(req.body)
                connection.end(function(error){
                    if(error){
                        console.log('connection end lost during Post request!')
                    }
                })
            })
        }
    })
})

app.put('/:levelid', function(req,res){
    var connection = mysql.createConnection(config)
    connection.connect(function(error){
        if(error){
            console.log('connection connect lost during Put request!')
        }
        else{
            connection.query("UPDATE `levels` SET `highscore` = '" + req.body.highscore + "' WHERE `id` = '" + req.params.levelid + "';", function(err, result){
                res.send(result);
                connection.end(function(error){
                    if(error){
                        console.log('connection end lost during Post request!')
                    }
                })
            })
        }
    })
})

app.listen(8081).on('error', console.log)
