var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

app.get('/', function (request, response) {
    response.send('dum is so piao liang.');
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
            sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
        }
    }
    res.sendStatus(200);
});

// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.EAAYu3JAk48cBAGt5wplREbUbO2D3PBjVJyENWMYbqw4ZBUynd6O0hXo920vx4l0KDmjDpv0TGGkxv4ywZCDXrG8gH2EUZC0wW3yeA8gAl5bJZAvjHNsr3atzGmZAzdZCnr7fr2VzZCxMchXvpbJHYccXWJn0YfsA2iaUz15agpq4gZDZD},
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
