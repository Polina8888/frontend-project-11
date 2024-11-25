export const renderModal = (watchedState) => {
  const currentId = watchedState.uiState.currentPostId;
  const currentPost = watchedState.posts.find(({ postId }) => postId === currentId);
  const { postTitle, postDescription, postLink } = currentPost;

  const modalTitle = document.querySelector('.modal-title');
  modalTitle.textContent = postTitle;
  const modalBody = document.querySelector('.modal-body');
  modalBody.textContent = postDescription;
  document.querySelector('.full-article').setAttribute('href', postLink);

  const modalBackdrop = document.createElement('div');
  modalBackdrop.classList.add('modal-backdrop', 'fade', 'show');
  document.body.appendChild(modalBackdrop);

  const modal = document.getElementById('modal');
  modal.classList.add('show');
  modal.style.display = 'block';
  document.body.classList.add('modal-open');
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = '0px';

  const closeModal = () => {
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    modalBackdrop.remove();
  };

  const checkIfModal = (el) => {
    const modalDialog = document.querySelector('.modal-dialog');
    if (el === modalDialog || modalDialog.contains(el)) {
      return true;
    }
    return false;
  };

  window.addEventListener('click', (e) => {
    if (e.target.dataset.bsToggle !== 'modal') {
      if (e.target.dataset.bsDismiss === 'modal' || !checkIfModal(e.target)) {
        closeModal();
      }
    }
  });

  document.querySelector('.btn-close').addEventListener('click', () => {
    closeModal();
  });
};

export const markIfVisited = (watchedState) => {
  watchedState.uiState.visitedPosts.forEach((id) => {
    const postAEl = document.querySelector(`a[data-id="${id}"]`);
    postAEl.classList.remove('fw-bold');
    postAEl.classList.add('fw-normal');
  });
};
