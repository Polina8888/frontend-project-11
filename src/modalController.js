import { renderModal } from '../view/modal.js';

export default (watchedState, id) => {
  const post = watchedState.posts.find((statePost) => statePost.postId === id);
  const {
    postTitle, postDescription, postLink, postId,
  } = post;

  if (watchedState.uiState.visitedPosts.length) {
    if (!watchedState.uiState.visitedPosts.includes(postId)) {
      watchedState.uiState.currentPost = { postTitle, postDescription, postLink };
      watchedState.uiState.visitedPosts.push(postId);
    } else {
      watchedState.uiState.currentPost = { postTitle, postDescription, postLink };
      renderModal(watchedState);
    }
  } else {
    watchedState.uiState.currentPost = { postTitle, postDescription, postLink };
    watchedState.uiState.visitedPosts.push(postId);
  }
};
