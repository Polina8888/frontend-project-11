import { renderModal } from '../view/modal.js';

export default (watchedState, id) => {
  const post = watchedState.posts.find((statePost) => statePost.postId === id);
  const { postId } = post;

  if (watchedState.uiState.visitedPosts.length) {
    if (!watchedState.uiState.visitedPosts.includes(postId)) {
      watchedState.uiState.currentPostId = postId;
      watchedState.uiState.visitedPosts.push(postId);
    } else {
      watchedState.uiState.currentPostId = postId;
      renderModal(watchedState);
    }
  } else {
    watchedState.uiState.currentPostId = postId;
    watchedState.uiState.visitedPosts.push(postId);
  }
};
