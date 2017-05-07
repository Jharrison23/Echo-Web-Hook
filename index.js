'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const restService = express();

var firebase = require('firebase-admin');

var serviceAccount = require("./echo-service-account.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    //serviceAccount: "./echo-service-account.json",
    databaseURL: "https://echo-8abf0.firebaseio.com/"
});


var ref = firebase.database().ref('EchoBot');


var messagesRef = ref.child('User Speech');

 ref.once('value')
        .then(function(snapShot){
            console.log("The key: " + snapShot.key, "\n\n");
            console.log("The ref: " + snapShot.ref.toString(), "\n\n");
            console.log(snapShot.val());
        });


restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

restService.post('/myecho', function(req, res) {
    var speech = req.body.result && req.body.result.parameters && 
                 req.body.result.parameters.echoText ? 
                 req.body.result.parameters.echoText : "Seems like some problem. Speak again."
  
    
    // Pushes the text from the user to the firebase database
    // pushes into the the AnaBot -> Messages table.

   // .push creates a push key, the push key shows up as the weird string
   // under messages looks like an id, push keys are critical to firebase, 
   // theyre like time stamps with alot of randomness to avoid collision
    messagesRef.push({
        UserSent: speech
    });


    // ref.once('value')
    //     .then(function(snapShot){
    //         console.log(snapShot.key, "\n\n");
    //         console.log(snapShot.ref.toString(), "\n\n");
    //         console.log(snapShot.val(),"\n\n");
    //     });

    //sendMessage();

    return res.json({
        speech: speech,
        displayText: speech,
        source: 'echo-web-hook'
        
    });

    



  //  writeUserData(speech);

// //    var bigOne = document.getElementById('bigOne');
//     var dbRef = firebase.database().ref().child('text');
//     dbRef.on('value', snap => speech.innerText = snap.val());

});







//---------------------------

// function sendMessage(){
//     console.log("Helow world");

//     messagesRef.push({
//         UserSent: "speech"
//     });

//     return res.json({
//         speech: "speech",
//        // displayText: speech,
//         source: 'echo-web-hook'
        
//     });

// }





// function writeUserData(speechText) {
//   firebase.database().ref('AnaBot/' + userId).set({
//     text: speechText
//   });
// }

restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
