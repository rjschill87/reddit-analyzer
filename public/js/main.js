const socket = io();

$(document).ready(() => {

  if ($('.ra-c-post').length) {
    setInterval(getNewVotesData, 10000);
  }
});

function getNewVotesData() {
  const $posts = $('.ra-c-post');
  const postArr = [];

  $posts.each((i, el) => {
    const $post = $(el);
    const postData = {
      id: $post.attr('id'),
      timestamp: $post.attr('data-timestamp'),
      upvotes: $post.attr('data-upvotes')
    };

    postArr.push(postData);

    if (i === $posts.length - 1) {
      socket.emit('updatePosts', { posts: postArr }, (res) => {
        updateVoteData(res);
      });
    }
  });
}

function updateVoteData(postArray) {
  for (i = 0; i < postArray.length; i++) {
    const post = postArray[i];
    const $postEl = $('#' + post.id);
    const $voteAvg = $postEl.find('.js-ra-vote-avg');

    $postEl.attr('data-timestamp', post.timestamp);
    $postEl.attr('data-upvotes', post.upvotes);
    $voteAvg.text(post.upvotesPerMinute);
  }
}
