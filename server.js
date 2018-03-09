console.log("hop");

var express = require("express");



var app = express();

/**Thibault**/
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/****/


var MongoClient = require("mongodb").MongoClient;

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


app.use("/css", express.static(__dirname + "/html/css"));
app.use("/images", express.static(__dirname + "/image"));
app.use("/js", express.static(__dirname + "/html/js"));

/* ALEXIS */
var session = require('express-session');
var sess;
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret: 'azertylogqwerty'}));

/* gestion des routes  */
app.get("/", function (req,res) {
    sess = req.session;
    console.log(sess.mail);
    res.sendFile(__dirname + "/html/login.html");
})
.get("/accueil", function (req,res) {
    sess = req.session;
    console.log(sess.mail);
    if(typeof sess.mail === "undefined" || sess.mail == "" || sess.mail == null)
        res.redirect('/');
    else if(sess.typeCompte == "internaute")
        res.sendFile(__dirname + "/html/myTickets.html");
    else if(sess.typeCompte == "operateur")
        console.log("faire la redirection pour les opérateurs");
        //res.sendFile(__dirname  + "/html/myTickets.html");

})

// Requete ajax
.get("/disconnect", function(req,res){
    sess = req.session;
    req.session.destroy(function(err) {
        if(err)
            console.log(err); 
        else
            res.end(JSON.stringify({status : 200, message : "Disconnected"}));
    })
})
.get("/loadMyTickets", function(req,res){
    sess = req.session;
    db.collection("tickets").find({ mail:sess.mail }).toArray(function(err,tkts){
        res.json({ tickets: tkts });
    });
})
.post("/connect", function(req,res){
    var rep;
    db.collection("Compte").find( { mail:req.body.mail, mdp:req.body.mdp } ).toArray(function(err,cmpt){
        console.log(cmpt.length);
        if(cmpt.length > 0) {
            sess = req.session;
            sess.mail = cmpt[0].mail;
            sess.typeCompte = cmpt[0].typeCompte;
            console.log(sess.mail);
            rep = { status : 200, message : "Connected"};
        }
        else {
            console.log("Bad login detected");
            rep = { status : 401, message : "Bad login"};
        }
        res.end(JSON.stringify(rep));
    });
});


/**Thibault**/

app.get("/sendTicket", function(req,res)
{
    sess = req.session;
    console.log(sess.mail);
    if(typeof sess.mail === "undefined" || sess.mail == "" || sess.mail == null)
        res.redirect('/');
    else if(sess.typeCompte == "internaute")
        res.sendFile(__dirname + "/html/ticketsCreation.html");
    else
        res.redirect('/');
});


app.get("/qualification", function(req,res)
{
    db.collection("Qualification").find().toArray(function(err, value){
        res.json({qualifications : value});
    })
});

app.get("/precision/:qualification", function(req,res)
{
    console.log(req.params);
    db.collection("Precision").find({qualification : req.params.qualification})
    .toArray(function(err, value){
        res.json({precisions : value});
    });
});


app.post('/ticket/add', function(req, res) {
    sess = req.session;
    req.body.mail = sess.mail;
    

    db.collection("tickets").insertOne(req.body, function(err, res) {
        if (err) throw err;
        console.log("1 user inserted");
    });

    var response = {
    status  : 200,
    success : 'Updated Successfully'
    }

    res.end(JSON.stringify(response));
});



/****/

app.listen(8125);