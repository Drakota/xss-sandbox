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
  socket.emit('sendUsername', username);
});

socket.on('init', function (res) {
  res.messages.forEach(function(message) {
    var messageClass;
    if (message.username === username) {
      messageClass = "replies";
    }
    else messageClass = "sent";
    $('#messages').append($('<li class="'+messageClass+'">').html(`
      <img src="/images/default.png" alt="" />
      <p><em style="font-size:15px;font-weight: bold;">`+message.username+`</em><br>`+message.body+`</p>
    `));
  });
  $(".messages").animate({ scrollTop: $(".messages")[0].scrollHeight }, "fast");
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
      <p><em style="font-size:15px;font-weight: bold;">`+message.username+`</em><br>`+message.body+`</p>
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
