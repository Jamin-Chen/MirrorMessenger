var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

app.get('/', function (request, response) {
    response.send('This is the Raspberry Pi Messenger Bot.');
});

app.get('/webhook', function (request, response) {
    if (request.query['hub.verify_token'] === 'testbot_verify_token') {
        response.send(request.query['hub.challenge']);
    } else {
        response.send('Invalid verify token');
    }
});

// handler receiving messages
app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            sendDefaultMessage(event.sender.id);
        } else if (event.postback) {
            // code to handle postbacks, doesn't work rn
            console.log("postback:");
            console.log(JSON.stringify(event.postback.payload));
        }
    }
    res.sendStatus(200);
});

// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

function sendTextMessage(recipientId, text) {
    sendMessage(recipientId, {text:text});
};

function sendDefaultMessage(recipientId) {
    sendMessage(recipientId, {
        "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":"What do you want to do?",
                "buttons":[
                  {
                    "type":"postback",
                    "title":"Send a message",
                    "payload":"test_payload"
                  },
                  {
                    "type":"postback",
                    "title":"Change location",
                    "payload":"USER_DEFINED_PAYLOAD"
                  }
                ]
              }
          }
        });
};
