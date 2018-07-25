/**
 * POST /sub
 * Subreddit data page.
 */

const request = require('request');
const moment = require('moment');

exports.index = (req, res) => {
  const subreddit = (req.query && req.query.subreddit) ? req.query.subreddit : 'all';

  getSubreddit(subreddit, (err, results) => {
    if (err) return;

    const averageComments = averageArray(results.commentCountArr);
    const averageUpvotes = averageArray(results.upvoteCountArr);
    const averageAge = averageArray(results.hourArr);

    res.render('subreddit/subreddit', {
      pageTitle: `r/${subreddit}`,
      averageComments,
      averageUpvotes,
      averageAge
    });
  });
};

function getSubreddit(sub, callback) {
  const url = `https://www.reddit.com/r/${sub}.json`;

  request.get(url, (err, res, body) => {
    if (err) return;

    const parsedBody = JSON.parse(body);
    const posts = parsedBody.data.children;
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
}

function averageArray(array) {
  const sum = array.reduce((p, c) => p + c, 0);
  const avg = parseInt(sum / array.length);
  // regex to add comma every 3 digits
  const formattedAverage = avg.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return formattedAverage;
}
