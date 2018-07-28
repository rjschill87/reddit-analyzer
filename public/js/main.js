$(document).ready(() => {
  const socket = io();
  socket.emit('page.loaded', {message: 'page loaded'});
});
