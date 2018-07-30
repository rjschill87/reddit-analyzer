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
    const postArr = [];
    const now = moment();

    posts.forEach((post, index) => {
      // get our time diff. between creation and now
      const createdAt = moment.unix(post.data.created_utc);
      const hourDiff = now.diff(createdAt, 'hours', true);
      const minutes = (createdAt.hour() * 60) + createdAt.minute();
      const upvotesPerMinute = upvotesPerMin(minutes, post.data.ups);

      const newPostObj = {
        id: post.data.id,
        title: post.data.title,
        author: post.data.author,
        link: `https://www.reddit.com${post.data.permalink}`,
        age: parseFloat(hourDiff).toFixed(2),
        prevTimestamp: now.unix(),
        prevUpvotes: post.data.ups,
        upvotesPerMinute
      };

      postArr.push(newPostObj);
      hourArr.push(hourDiff);
      upvoteCountArr.push(parseInt(post.data.ups));
      commentCountArr.push(parseInt(post.data.num_comments));

      if (index === (posts.length - 1)) {
        const data = {
          upvoteCountArr,
          commentCountArr,
          hourArr,
          postArr
        };
        callback(null, data);
      }
    });
  });
};

Query.fetchUpdatedPostsData = (posts, callback) => {
  if (!posts.length) {
    return callback('No posts received.');
  }

  const postArr = [];

  posts.forEach((post, index) => {
    const url = `https://www.reddit.com/comments/${post.id}.json`;
    const previousFetch = moment.unix(post.timestamp);
    const previousUpvotes = post.upvotes;

    request.get(url, (err, res, body) => {
      const parsedBody = JSON.parse(body);
      const openingPost = parsedBody[0].data.children[0];

      // get time between last fetch and now
      const now = moment();
      const minutes = now.diff(previousFetch, 'minutes', true);

      // get upvotes since last fetch
      const upvoteDifference = parseInt(openingPost.data.ups - previousUpvotes);

      // get an estimate of votes per min
      const upvotesPerMinute = upvotesPerMin(minutes, upvoteDifference);

      const newPostObj = {
        id: openingPost.data.id,
        timestamp: now.unix(),
        upvotes: openingPost.data.ups,
        upvotesPerMinute
      };

      postArr.push(newPostObj);

      if (index === posts.length - 1) {
        callback(postArr);
      }
    });
  });
};

function upvotesPerMin(minute, upvotes) {
  return parseInt(upvotes / minute);
}
