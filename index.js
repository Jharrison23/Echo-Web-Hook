'use strict';




const express = require('express');
const bodyParser = require('body-parser');

const restService = express();

var firebase = require('firebase');

firebase.initializeApp({

    serviceAccount: "./echo-service-account.json",
    databaseURL: "https://echo-8abf0.firebaseio.com/"
});


var ref = firebase.database().ref('AnaBot');


var messagesRef = ref.child('messages');

// messagesRef.push({
//     name: 'Not JAmes',
//     admin:true,
//     count: 1,
//     text:'Hello'
// });

//  var config = {
//         apiKey: "AIzaSyB3hhlOYw5iVfxz_ac6e2mz4FIgbL0gifE",
//         authDomain: "echo-8abf0.firebaseapp.com",
//         databaseURL: "https://echo-8abf0.firebaseio.com",
//         projectId: "echo-8abf0",
//         storageBucket: "echo-8abf0.appspot.com",
//         messagingSenderId: "689817280332"
//     };
//     firebase.initializeApp(config);

 

restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

restService.post('/myecho', function(req, res) {
    var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.echoText ? req.body.result.parameters.echoText : "Seems like some problem. Speak again."
    
    // Pushes the text from the user to the firebase database
    // pushes into the the AnaBot -> Messages table.
    messagesRef.push({
        name: 'echoed speech',
        admin:true,
        count: 2,
        text: speech
    });

    
    return res.json({
        speech: speech,
        displayText: speech,
        source: 'echo-web-wook'


        
    });

    



  //  writeUserData(speech);

// //    var bigOne = document.getElementById('bigOne');
//     var dbRef = firebase.database().ref().child('text');
//     dbRef.on('value', snap => speech.innerText = snap.val());

});

// function writeUserData(speechText) {
//   firebase.database().ref('AnaBot/' + userId).set({
//     text: speechText
//   });
// }

restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
