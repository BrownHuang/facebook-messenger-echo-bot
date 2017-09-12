let express = require('express')
let bodyParser = require('body-parser')
let request = require('request')
let app = express()

const FACEBOOK_ACCESS_TOKEN = 'EAAE2ztcT6MsBAHxaOOCtZBF0RrsHW3ouo6DPOWCVJUwDpXNSXEpIgZC3IkfJerMcaSaXpZAIGENm3eguoVTnQ0bsOG6mXtlbSZAAn7LhtRhcZCgCxiBMPjZCwre5CZBARZCQ55dsZALQQQTG6bmNLnzZBpDdwfXTuLsEISmKTEzZBhOfgZDZD'
const PORT = process.env.PORT || 3000
const VERIFY_TOKEN = 'Chatbot_Verify_Token'

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}!`)
})

// Facebook Webhook
app.get('/', function (req, res) {
    if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
        res.send(req.query['hub.challenge'])
    } else {
        res.send('Invalid verify token')
    }
})

// handler receiving messages
app.post('/', function (req, res) {
    let events = req.body.entry[0].messaging
    for (i = 0; i < events.length; i++) {
        let event = events[i]
        if (event.message) {
            if (event.message.text) {

                if(event.message.text === '你叫什麼名字'){
                    sendMessage(event.sender.id,{text : '黃柏融'})
                }else if (event.message.text === '你的信箱'){
                    sendMessage(event.sender.id,{text: 'b9602104@gmail.com'})
                }else{
                    sendMessage(event.sender.id, { text: event.message.text })                    
                }
            }
        }
    }
    res.sendStatus(200)
})

// generic function sending messages
function sendMessage(recipientId, message) {
    let options = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: recipientId },
            message: message,
        }
    }
    request(options, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        }
        else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    })
}
