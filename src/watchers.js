import onChange from 'on-change';
import { renderFeeds } from './rss.js';

export default (state, elements, i18nextInstance) => {
  const watchedState = onChange(state, (path) => {
    if (path === 'form.error') {
      if (state.form.error.length) {
        elements.input.classList.add('is-invalid');
        elements.feedback.textContent = state.form.error;
        elements.feedback.classList.remove('text-success');
        elements.feedback.classList.add('text-danger');
      } else {
        elements.feedback.textContent = state.form.error;
        elements.input.classList.remove('is-invalid');
        elements.feedback.classList.add('text-success');
        elements.feedback.classList.remove('text-danger');
      }
    } else if (path === 'feed' || path === 'posts') {
      renderFeeds(watchedState, i18nextInstance, elements);
    }
  });

  return watchedState;
};
