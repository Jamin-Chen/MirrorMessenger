var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    cleverbot = require('cleverbot.io');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

bot = new cleverbot("vHyQyWFeYORet3OW", "nBx58uR78n2earRCalcjrRYfA75B5yTb");

bot.create(function(err, session) {});

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
            bot.ask(event.message.text, function (err, response) {
                sendMessage(event.sender.id, {text: response});
            });
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
