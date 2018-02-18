module.exports.connectedUsers = (sockets) => {
  var connected = [];
  for (var socketId in sockets) {
      connected.push(sockets[socketId].username);
  }
  return Array.from(new Set(connected));
}
