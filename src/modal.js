export const renderModal = (watchedState) => {

};

export const markIfVisited = (watchedState) => {
  watchedState.uiState.posts.forEach(({ id, postState }) => {
    const postAEl = document.querySelector(`[data-id="${id}"]`);
    console.log(postState);
    if (postState === 'visited') {
      postAEl.classList.remove('fw-bold');
      postAEl.classList.add('fw-normal');
    } else {
      postAEl.classList.add('fw-bold');
      postAEl.classList.remove('fw-normal');
    }
  });
};
