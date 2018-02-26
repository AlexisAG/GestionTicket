var express = require("express");
var app = express();
var MongoClient = require("mongodb").MongoClient;


// connexion à la bdd 
var db;
MongoClient.connect('mongodb://localhost:27017/gayale',
    function(err,_db)  {
        if (err)
            console.log("Erreur de connexion à mongodb");
        else {
            console.log("Yeah! Connected!");
            db = _db;
        }
    });

// gestion des routes 
app.use("/css", express.static(__dirname + "/html/css"))
.use("/images", express.static(__dirname + "/images"))
.use("/js", express.static(__dirname + "/html/js"))

.get("/", function (req,res) {
	res.sendFile(__dirname + "/html/index.html");
})

.get("/message", function(req,res){
	db.collection("messages").find().toArray(function(err,msg){
		res.json({ message: msg[0].text });
	});
});

app.listen(8093);


