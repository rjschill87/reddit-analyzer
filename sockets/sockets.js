const Sockets = module.exports;

Sockets.init = (socket) => {
  socket.on('page.loaded', (data) => {
    console.log('>>> loaded', data);
  });
};
