var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var csv = require('ya-csv');


var app = express();
app.use(express.static(path.join(__dirname, "")));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(request, response){
    response.sendFile(path.join(__dirname, "pages/game.html"));
});

app.get("/score", function(request, response) {
    var reader = csv.createCsvFileReader("scores.csv");
    reader.setColumnNames(['name', 'score']);

    var scores = [];
    reader.addListener('data', function(data) {
        scores.push(data);
    });

    reader.addListener('end', function(){
        response.send(scores);
    })
});

app.post('/score', function(request, response){
    var name = request.body.fullName;
    //var email = request.body.email;
    var score = request.body.score;
    var database = csv.createCsvFileWriter("scores.csv", {"flags": "a"});
    var data = [name, score];
    database.writeRecord(data);
    database.writeStream.end();
    //response.send("Thanks " + name + ", your score has been recorded!");

    //response.send(request.body.fullName + " ("
    //+ request.body.email + ") score: " + request.body.score);
    //
    //console.log("score thigndbuibisf");

});


//(process.env.PORT || 8080)

var server = app.listen((process.env.PORT || 8080), function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Bob's Flappy Bird listening at http://%s:%s", host, port);
});
