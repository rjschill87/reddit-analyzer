const request = require('request');
const moment = require('moment');

const Query = module.exports;

Query.getSubreddit = (sub, callback) => {
  const url = `https://www.reddit.com/r/${sub}.json`;

  request.get(url, (err, res, body) => {
    if (err) return;

    const parsedBody = JSON.parse(body);
    const posts = parsedBody.data.children;

    callback(null, posts);
  });
};

Query.getBasicStats = (sub, callback) => {
  this.getSubreddit(sub, (err, posts) => {
    if (err) return callback(err);

    const upvoteCountArr = [];
    const commentCountArr = [];
    const hourArr = [];
    const now = moment();

    posts.forEach((post, index) => {
      // get our time diff. between creation and now
      const createdAt = moment.unix(post.data.created_utc);
      const hourDiff = now.diff(createdAt, 'hours');

      hourArr.push(hourDiff);
      upvoteCountArr.push(parseInt(post.data.ups));
      commentCountArr.push(parseInt(post.data.num_comments));

      if (index === (posts.length - 1)) {
        const data = {
          upvoteCountArr,
          commentCountArr,
          hourArr
        };
        callback(null, data);
      }
    });
  });
};
