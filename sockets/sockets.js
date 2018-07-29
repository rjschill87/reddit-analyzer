const Queries = require('./../lib/queries');

const Sockets = module.exports;

Sockets.init = (socket) => {
  socket.on('updatePosts', (data, callback) => {
    if (!data.posts.length) {
      callback('No post data received.');
    }

    Queries.fetchUpdatedPostsData(data.posts, (res) => {
      callback(res);
    });
  });
};
