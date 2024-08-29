export const renderModal = (watchedState) => {

};

export const markIfVisited = (watchedState) => {
  watchedState.uiState.visitedPosts.forEach((id) => {
    const postAEl = document.querySelector(`[data-id="${id}"]`);
    postAEl.classList.remove('fw-bold');
    postAEl.classList.add('fw-normal');
  });
};
