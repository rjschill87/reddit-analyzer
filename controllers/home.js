/**
 * GET /
 * Home page.
 */

const request = require('request');

exports.index = (req, res) => {
  getSubreddit('all', (err, postTitles) => {
    if (err) return;

    res.render('home', {
      pageTitle: 'POSTS',
      titles: postTitles
    });
  });
};

function getSubreddit(sub, callback) {
  const url = `https://www.reddit.com/r/${sub}.json`;

  request.get(url, (err, res, body) => {
    if (err) return;

    const parsedBody = JSON.parse(body);
    const posts = parsedBody.data.children;
    const postTitles = posts.map(post => post.data.title);

    callback(null, postTitles);
  });
}
