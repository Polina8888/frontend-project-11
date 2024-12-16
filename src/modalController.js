export default (watchedState, id) => {
  const post = watchedState.posts.find((statePost) => statePost.postId === id);
  const { postId } = post;

  watchedState.uiState.currentPostId = postId;
  if (!watchedState.uiState.visitedPosts.includes(postId)) {
    watchedState.uiState.visitedPosts.push(postId);
  }
};
