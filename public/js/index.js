var socket = io();
var username = '';

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

socket.on('connect', function () {
  console.log('Connected to server');
  username = getCookie('username');
});

socket.on('init', function (res) {
  res.messages.forEach(function(message) {
    $('#messages').append($('<li>').text(`From: ${message.username} - ${message.body}`));
  });
  $("#messages").scrollTop($("#messages")[0].scrollHeight);
});

socket.on('disconnect', function () {
  console.log('Disconnected to server');
});

socket.on('newMessage', function(message) {
    $('#messages').append($('<li>').text(`From: ${message.username} - ${message.body}`));
    $("#messages").scrollTop($("#messages")[0].scrollHeight);
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
