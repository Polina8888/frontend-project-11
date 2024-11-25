import onChange from 'on-change';
import { markIfVisited, renderModal } from './modal.js';
import renderFeeds from './renderFeeds.js';
import renderPosts from './renderPosts.js';

export default (state, elements, i18nextInstance) => {
  const watchedState = onChange(state, (path) => {
    if (path === 'form.error') {
      if (state.form.error.length) {
        elements.input.classList.add('is-invalid');
        elements.feedback.textContent = state.form.error;
        elements.feedback.classList.remove('text-success');
        elements.feedback.classList.add('text-danger');
      } else {
        elements.feedback.textContent = i18nextInstance.t('successfullyLoaded');
        elements.input.classList.remove('is-invalid');
        elements.feedback.classList.add('text-success');
        elements.feedback.classList.remove('text-danger');
      }
    } else if (path === 'feeds' || path === 'posts') {
      renderFeeds(watchedState, i18nextInstance, elements);
      renderPosts(watchedState, i18nextInstance, elements);
    } else if (path === 'uiState.visitedPosts') {
      markIfVisited(watchedState);
      renderModal(watchedState);
    }
  });

  return watchedState;
};
