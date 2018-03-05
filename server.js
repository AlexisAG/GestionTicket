var express = require("express");       
var app = express();
var mongoClient = require("mongodb").MongoClient;


// connexion à la bdd 
var db;
mongoClient.connect('mongodb://localhost:27017/gayale',
    function(err, _db)  {
        if (err)
            console.log("Erreur de connexion à mongoDB");
        else {
            console.log("Yeah! Connected!");
            db = _db;
        }
    });

// gestion des routes 
app.use("/css", express.static(__dirname + "/html/css"))
.use("/images", express.static(__dirname + "/images"))
.use("/js", express.static(__dirname + "/html/js"))

/***** Routes toutes pages sauf celle du user *****/
.get('/', function (req, res) {
    res.sendFile(__dirname + "/html/requalificationTicket.html");
})

.get("/gestion", function (req,res) {
	res.sendFile(__dirname + "/html/login.html");
})

.get("/message", function(req,res){
	db.collection("messages").find().toArray(function(err,msg){
		res.json({ message: msg[0].text });
	});
})

.post("/gestion/connect", function(req, res) {
    res.sendFile(__dirname + "/html/creaVisuRapport.html");
})

.post("/gestion/connect/liste", function(req, res) {
    res.sendFile(__dirname + "/html/listeTickets.html");
})

.post("/gestion/connect/test",function(req, res) {
    res.sendFile(__dirname + "/html/gestionTicket.html");
})

app.listen(8142);