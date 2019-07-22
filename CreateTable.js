require('dotenv').config()
var mysql = require('mysql')
var connection = mysql.createConnection({
    host        : process.env.HOST,
    user        : process.env.DATABASE_USER,
    password    : process.env.PASSWORD,
    database    : process.env.DATABASE,
    port        : process.env.DATABASE_PORT
}
);

connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... nn")
        createTable(connection)
    } else {
        console.log("Error connecting database ... nn")
        console.log(err)
    }
}
)

function createTable(con){
    var sqlString = "CREATE TABLE levels (id INT(11), name VARCHAR(255),imageurl VARCHAR(2083), leveltext VARCHAR(255), highscore FLOAT(7,4))"

    con.query(sqlString,function(err,result){
        if(err) throw err;
        console.log("Table created")
    })
}
