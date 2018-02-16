const express = require('express');
const http = require('http');
const hbs = require('hbs');
const socketIO = require('socket.io');
const cookieParser = require('cookie-parser');
const path = require('path');

const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var messages = [];

app.use(express.static(publicPath));
app.use(cookieParser());

app.get('/username', (req, res) => {
  res.render('username.hbs');
});

app.use(function(req,res,next){
    if (!req.cookies.username) {
      return res.redirect('/username');
    }
    next();
});

app.get('/', (req, res) => {
  res.render('index.hbs');
});

io.on('connection', (socket) => {
  console.log('New User connected');
  io.to(socket.id).emit('init', {messages});

  socket.on('newMessage', (message) => {
    messages.push(message);
    io.emit('newMessage', message);
  });

  socket.on('disconnect', () => {
  });
});

server.listen(port, () => {
  console.log('Server is up and running on port ' + port);
});
