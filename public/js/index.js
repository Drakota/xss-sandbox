var socket = io();
var username = '';

$(document).ready(function(){
    update();
    setInterval(update, 1000);
});

function update () {
    socket.emit('refreshChat');
};

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

socket.on('refreshChat', function (res) {
  $('#messages').empty();
  refreshChat(res);
});

function refreshChat(res)
{
  res.messages.forEach(function(message) {
    var messageClass;
    if (message.username === username) {
      messageClass = "replies";
    }
    else messageClass = "sent";
    $('#messages').append($('<li class="'+messageClass+'">').html(`
      <img src="/images/default.png" alt="" />
      <p style="word-break: break-all;"><em style="font-size:15px;font-weight: bold;">`+message.username+`</em>
      <em style="font-size:15px;font-weight:lighter;margin-left:10px;float:right;">`+moment(message.createAt).fromNow()+`</em><br>`+message.body+`</p>
    `));
  });
}

socket.on('connect', function () {
  console.log('Connected to server');
  username = getCookie('username');
  socket.emit('sendUsername', username);
});

socket.on('usersConnected', function (users) {
  $('#contacts-panel').empty();
  users.forEach(function(user) {
    $('#contacts-panel').append($('<li class="contact">').html(`
      <div class="wrap">
        <span class="contact-status online"></span>
        <img src="/images/default.png" alt="" />
        <div class="meta">
          <p class="name">`+user+`</p>
        </div>
      </div>
    `));
  });
});

socket.on('newMessage', function(message) {
    var messageClass;
    if (message.username === username) {
      messageClass = "replies";
    }
    else messageClass = "sent";
    $('#messages').append($('<li class="'+messageClass+'">').html(`
      <img src="/images/default.png" alt="" />
      <p style="word-break: break-all;"><em style="font-size:15px;font-weight: bold;">`+message.username+`</em>
      <em style="font-size:15px;font-weight:lighter;margin-left:10px;float:right;">`+moment().startOf(message.createAt).fromNow()+`</em><br>`+message.body+`</p>
    `));
    $(".messages").animate({ scrollTop: $(".messages")[0].scrollHeight }, "fast");
});

$("#chatBar").keyup(function(event) {
    if (event.keyCode === 13) {
      if ($("#chatBar").val() !== '') {
        socket.emit('newMessage', {
          id: socket.id,
          body: $("#chatBar").val(),
          username,
        });
        $("#chatBar").val('');
      }
    }
});

$( "#sendBtn" ).click(function() {
  if ($("#chatBar").val() !== '') {
    socket.emit('newMessage', {
      id: socket.id,
      body: $("#chatBar").val(),
      username,
    });
    $("#chatBar").val('');
  }
});
