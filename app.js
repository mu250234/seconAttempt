var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var router      =   express.Router();

var mongoOp     =   require("./lib/crud");
var crypto = require('crypto');
  

//mongoose for mongo client



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

router.get("/",function(req,res){
    res.json({"error" : false,"message" : "Hello World"});
});

//route() will allow you to use same path for different HTTP operation.
//So if you have same URL but with different HTTP OP such as POST,GET etc
//Then use route() to remove redundant code.

router.route("/users")
    .get(function(req,res){
        var user_id = req.query.userEmail;
        console.log(user_id);
         var response = {};
        mongoOp.find({ "userEmail": user_id},function(err,data){
            
        // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            }
            else{
                response=data;
            }
            res.json(response);
        });
        
    })
    .post(function(req,res){
        var db = new mongoOp();
        var response = {};
        // fetch email and password from REST request.
        // Add strict validation when you use this in Production.
        db.userEmail = req.body.email; 
        // Hash the password using SHA1 algorithm.
        db.userPassword = require('crypto').createHash('md5').update(req.body.password, 'utf8').digest('hex');

                          
                          
        db.save(function(err){
        // save() will run insert() command of MongoDB.
        // it will add new data in collection.
            if(err) {
                response = {"error" : true,"message" : "Error adding data"};
            } else {
                response = {"error" : false,"message" : "Data added"};
            }
            res.json(response);
        });
    });

app.use('/',router);

app.listen(3000);
console.log("Listening to PORT 3000");

//git test123


