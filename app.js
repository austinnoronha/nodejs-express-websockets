const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const cors = require('cors');

// Setup the index.html to be server from main dir
app.use(express.static(__dirname));

// Parse Post Body as JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

// Cors 
app.use(cors({
  origin: '*'
}));

// Model message
var Message = mongoose.model('Message',{
  name : String,
  message : String
})

// All messages are stored in a common array
var messages = [];

// Route GET /messages to get all messages
app.get('/messages', (req, res) => {
  Message.find({},(err, messages) => {
    res.send(messages);
  })
})

// Route POST /messages to add new  message in messages
app.post('/messages', (req, res) => {
  if(req.body.name == '' || req.body.message == ''){
    res.send('Body cannot be blank!', 500);
    return;
  }
  var message = new Message(req.body);
  messages.push(message);

  // Add to mongo DB using .save()
  // ...

  // Broadcast same message to all users connected
  io.emit('message', req.body);

  // HTTP send response code
  res.sendStatus(200);
})

// Socket.IO connection event listener
io.on('connection', () =>{
  console.log('**A new user is connected to your chat!')
})

// Server Express server on port 3000
var server = http.listen(3000, () => {
  console.log('Server is running on port: ', server.address().port);
  console.log('Website can be accessed on http://localhost:%s', server.address().port)
});