console.log("hop");

var express = require("express");

var Promise = require("promise");

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
var ObjectId = require('mongodb').ObjectId; 
var session = require('express-session');
var sess;
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret: 'azertylogqwerty'}));

function updateTicketSession(){
    db.collection("tickets").find( {_id: new ObjectId(sess.ticket[0]._id)}).toArray(function(err,tkt){
        if(tkt.length > 0){
            sess.ticket = tkt;
            res.end(JSON.stringify({ status : 200, message:"Ok"}));
        }
        else
            res.end(JSON.stringify({ status : 503, message:"Status 503 : Session not available"}));
    })
}


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
        res.sendFile(__dirname  + "/html/listeTickets.html");
    else if(sess.typeCompte == "chef")
        res.sendFile(__dirname  + "/html/creaVisuRapport.html");

})
.get("/gestionTicket", function(req,res) {
    sess = req.session;
    console.log(sess.mail);
    if(typeof sess.mail === "undefined" || sess.mail == "" || sess.mail == null)
        res.redirect('/');
    else
        res.sendFile(__dirname + "/html/gestionTicket.html");
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
    if(sess.typeCompte == "internaute") {
        db.collection("tickets").find({ mail:sess.mail }).toArray(function(err,tkts){
            res.json({ tickets: tkts });
        }); 
    }
    else if(sess.typeCompte == "operateur")
        db.collection("tickets").find({ mailOpe:sess.mail }).toArray(function(err,tkts){
            res.json({ tickets: tkts });
        });

})
.get("/loadFilter", function(req,res){
    var qualification;
    var precision;
    db.collection("Qualification").find().toArray(function(err,qualif){
        qualification = qualif;
        if(qualification.length > 0) {
            db.collection("Precision").find().toArray(function(err,preci){
                precision = preci;
                if(precision.length > 0)
                    res.json({ qualification:qualification,precision:precision })
                else
                    res.end(JSON.stringify({status : 503, error:"Status 503 : DataBase error"}));
            });
        } 
        else
            res.end(JSON.stringify({status : 503, error:"Status 503 : DataBase error"}));
    });
})
.get('/loadOperator', function(req,res){
    sess = req.session;

    if(sess.ticket != null){
        db.collection("Compte").find({competence : sess.ticket[0].precision}).toArray(function(err,ope){
            res.json({ operateurs:ope });
        });
    }
    else
        res.end(JSON.stringify({status : 503, error:"Status 503 : DataBase error"}));

})
.get("/manageTicket", function(req,res){
    sess = req.session;
    if(sess.ticket != null)
        res.json({ticket : sess.ticket});
    else 
        res.end(JSON.stringify({ status : 503, message:"Status 503 : Session not available"}));
})
.get("/clotureTicket", function(req,res){
    sess = req.session;
    if(sess.ticket != null){
        console.log(new ObjectId(sess.ticket[0]._id));
        db.collection("tickets").update( {_id : new ObjectId(sess.ticket[0]._id)}, {$set: { statut:"Cloturer" }});
        updateTicketSession();
    }
    else 
        res.end(JSON.stringify({ status : 503, message:"Status 503 : Session not available"}));
})
//post
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
})
.post("/manageTicket", function(req,res){
    var rep;
    db.collection("tickets").find( { _id:req.body._id} ).toArray(function(err,tkt){
        if(tkt.length > 0)
            rep = { item: tkt, status:200 };
        else
            rep = { status : 503, error:"DataBase error" };
        res.end(JSON.stringify(rep));
    })
})
.post("/setTicket", function(req,res){
    sess = req.session;
    db.collection("tickets").find( { _id : new ObjectId(req.body._id)} ).toArray(function(err,tkt){
        if(tkt.length > 0){
            sess.ticket = tkt;
            rep = { status : 200, message : "Ok" };
        }
        else
            rep = { status : 503, message:"Status 503 : DataBase error" };
        res.end(JSON.stringify(rep));
    })
})
.post("/requalificationTicket", function(req,res){
    sess = req.session;
    db.collection("tickets").update( {_id : new ObjectId(sess.ticket[0]._id)}, {$set: { qualification:req.body.qualification, precision:req.body.precision}});
    db.collection("Compte").update( {mail:sess.mail}, {$inc: {nbRequalificationTicket:1}});
    updateTicketSession();
})
.post("/redirigerTicket", function(req,res){
    sess = req.session;
    db.collection("tickets").update( {_id : new ObjectId(sess.ticket[0]._id)}, {$set: { mailOpe:req.body.mailOpe}});
    db.collection("Compte").update( {mail:sess.mail}, {$inc: {nbRequalificationTicket:1}});
    updateTicketSession();
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

app.get("/testGraph", function(req, res) {
    res.sendFile(__dirname + "/html/creaVisuRapport.html")
});



app.post('/ticket/add', function(req, res) {
    sess = req.session;
    req.body.mail = sess.mail;
    
    /*
    db.collection("tickets").insertOne(req.body, function(err, res) {
        if (err) throw err;
        console.log("1 user inserted");
    });

    /*Redirection ticket*/
    console.log(req.body);
    if(req.body.precision != null && req.body.precision != " ")
    {
        db.collection("Compte").find({typeCompte:"operateur",competence : req.body.precision})
        .toArray(function(err, value){
            var nbTicket = 1000;
            var mailCpt;

            var all = [];

            value.forEach(function(item){

                all.push(new Promise(function(resolve, reject) {

                    db.collection("tickets").find({mailOpe:item.mail}).count()
                    .then(function(tempNbTicket){
                            if(tempNbTicket < nbTicket)
                            {
                                console.log("hop");
                                nbTicket = tempNbTicket;
                                mailCpt = item.mail;
                                console.log("mailSearch : "+mailCpt);
                                
                            }
                            resolve();
                        })
                }))
            });

            Promise.all(all).then(function(){
                req.body.mailOpe = mailCpt;
                console.log("MailOpe : "+req.body.mailOpe);

                
                db.collection("tickets").insertOne(req.body, function(err, res) {
                    if (err) throw err;
                    console.log("1 user inserted");
                });
                
            })

            
        });
    }
    else
    {
        db.collection("Compte").find({typeCompte:"operateur"})
        .toArray(function(err, value){
            console.log(value);
            var nbTicket = 1000;
            var mailCpt;
            var all = [];

            value.forEach(function(item){
                
                all.push(new Promise(function(resolve, reject) {

                    db.collection("tickets").find({mailOpe:item.mail}).count()
                    .then(function(tempNbTicket){
                        console.log(tempNbTicket);
                        if(tempNbTicket < nbTicket)
                        {
                            nbTicket = tempNbTicket;
                            mailCpt = item.mail;
                            console.log("mailSearch : "+mailCpt);
                        }
                        resolve();
                    })
                }))
            });
            
            Promise.all(all).then(function(){
                req.body.mailOpe = mailCpt;
                console.log("MailOpe : "+req.body.mailOpe);

                
                db.collection("tickets").insertOne(req.body, function(err, res) {
                    if (err) throw err;
                    console.log("1 user inserted");
                });
                
            })
            
        });
    }
    


    var response = {
    status  : 200,
    success : 'Updated Successfully'
    }

    res.end(JSON.stringify(response));
});


/*New*/
app.post("/createRapport", function(req,res){
    var rep={};
    var all = [];

    all.push(new Promise(function(resolve, reject) {

        db.collection("tickets").find({mailOpe:req.body.mailOpe, statut:"En cours"}).count()
        .then(function(tempNbTicketEnCours){
            rep.ticketEnCour = tempNbTicketEnCours;
            resolve();
            
        })
    }));

    all.push(new Promise(function(resolve, reject) {

        db.collection("tickets").find({mailOpe:req.body.mailOpe, statut:"Cloturer"}).count()
        .then(function(tempNbTicketCloturer){
            rep.ticketCloturer = tempNbTicketCloturer;
            resolve();
            
        })
    }));

    all.push(new Promise(function(resolve, reject) {

        db.collection("Compte").find({mail:req.body.mailOpe}).toArray(function(err, value){
            console.log(value[0].nbTicketRediriger);
            rep.ticketRediriger = value[0].nbTicketRediriger;
            resolve();
            
        })
    }));

    Promise.all(all).then(function(){

        res.json({info : rep});
        
        var response = {
        status  : 200,
        success : 'Updated Successfully'
        }

    });
});


app.post("/getOpe", function(req,res){
    db.collection("Compte").find({ typeCompte: "operateur"}).toArray(function(err,ops){
            res.json({ operateurs: ops });
    });
});

/****/

app.listen(8125);
