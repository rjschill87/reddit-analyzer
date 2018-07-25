/**
 * GET /
 * Home page.
 */

exports.index = (req, res) => {
  res.render('home', {
    pageTitle: 'Welcome to the Subreddit Analzyer'
  });
};
