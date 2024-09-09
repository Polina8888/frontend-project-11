export const renderModal = (watchedState) => {
  const { postTitle, postDescription, postLink } = watchedState.uiState.currentPost;
  const modalTitle = document.querySelector('.modal-title');
  modalTitle.textContent = postTitle;
  const modalBody = document.querySelector('.modal-body');
  modalBody.textContent = postDescription;
  document.querySelector('.full-article').setAttribute('href', postLink);

  const modal = document.getElementById('modal');
  modal.classList.add('show');
  modal.style.display = 'block';
  document.body.classList.add('modal-open');
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = '0px';

  window.addEventListener('click', (e) => {
    if (e.target.dataset.bsToggle !== 'modal') {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  });

  document.querySelector('.btn-close').addEventListener('click', () => {
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });
};

export const markIfVisited = (watchedState) => {
  watchedState.uiState.visitedPosts.forEach((id) => {
    const postAEl = document.querySelector(`a[data-id="${id}"]`);
    postAEl.classList.remove('fw-bold');
    postAEl.classList.add('fw-normal');
  });
};
