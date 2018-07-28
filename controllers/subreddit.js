/**
 * POST /sub
 * Subreddit data page.
 */

const queries = require('./../lib/queries');

exports.index = (req, res) => {
  const subreddit = (req.query && req.query.subreddit) ? req.query.subreddit : 'all';

  queries.getBasicStats(subreddit, (err, results) => {
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

function averageArray(array) {
  const sum = array.reduce((p, c) => p + c, 0);
  const avg = parseInt(sum / array.length);
  // regex to add comma every 3 digits
  const formattedAverage = avg.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return formattedAverage;
}
