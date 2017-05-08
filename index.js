'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

var firebase = require('firebase-admin');

var serviceAccount = require("./echo-service-account.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://echo-8abf0.firebaseio.com/"
});


var ref = firebase.database().ref('EchoBot');


var messagesRef = ref.child('Users');

var currentUser;

// Method which returns the key, reference string, and the logs in the database
 ref.once('value')
        .then(function(snapShot){
            console.log("The key: " + snapShot.key, "\n\n");
            console.log("The ref: " + snapShot.ref.toString(), "\n\n");
            console.log(snapShot.val());
        });


app.use(bodyParser.urlencoded({
    extended: true
}));





app.use(bodyParser.json());


app.post('/myecho', function(req, res) {
    



    if(name == req.body.result.parameters.userName)
    {
       
        //var reference = messagesRef.child(name.toString());
    
        var speech = req.body.result && req.body.result.parameters && 
                 req.body.result.parameters.echoText ? 
                 req.body.result.parameters.echoText : "Seems like some problem. Speak again."



        // Pushes the text from the user to the firebase database
        // pushes into the the AnaBot -> Messages table.

        // .push creates a push key, the push key shows up as the weird string
        // under messages looks like an id, push keys are critical to firebase, 
        // theyre like time stamps with alot of randomness to avoid collision
        messagesRef.child(String(name)).push({
            UserSent: speech
        });


        messagesRef.child(String(name)).push({
            ServerSent: "Server " + speech
        });

        return res.json({
            speech: speech,
            displayText: speech,
            source: 'echo-web-hook'
            
        }); 
}




var name = req.body.result && req.body.result.parameters && 
                 req.body.result.parameters.userName ? 
                 req.body.result.parameters.userName : "Seems like I dont have your name. Speak again."
  //console.log("The name is: " + name);

 messagesRef.push({
        UserName: name
     });


    // currentUser = String(name);

    // console.log("current user" + currentUser);
    
    return res.json({
        speech: name,
        displayText: speech,
        source: 'echo-web-hook'
        
    });

});



app.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});