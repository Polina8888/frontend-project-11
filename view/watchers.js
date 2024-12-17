import onChange from 'on-change';
import { markIfVisited, renderModal } from './modal.js';
import renderFeeds from './renderFeeds.js';
import renderPosts from './renderPosts.js';

export default (state, elements, i18nextInstance) => {
  const { feedback } = elements;

  const setFeedbackText = () => {
    if (state.form.error.length) {
      feedback.textContent = i18nextInstance.t(`errors.${state.form.error}`);
    } else {
      feedback.textContent = i18nextInstance.t('successfullyLoaded');
    }
  };

  const renderInvalid = () => {
    setFeedbackText();
    elements.input.classList.add('is-invalid');
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
  };

  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'form.error':
        if (state.form.error.length) {
          renderInvalid();
        } else {
          elements.form.reset();
          elements.input.focus();

          setFeedbackText();
          elements.input.classList.remove('is-invalid');
          elements.feedback.classList.add('text-success');
          elements.feedback.classList.remove('text-danger');
        }
        break;
      case 'feeds':
        renderFeeds(watchedState, i18nextInstance, elements);
        renderPosts(watchedState, i18nextInstance, elements);
        break;
      case 'posts':
        renderPosts(watchedState, i18nextInstance, elements);
        break;
      case 'uiState.visitedPosts':
        markIfVisited(watchedState);
        renderModal(watchedState);
        break;
      case 'isAwaiting':
        if (watchedState.form.error.length && watchedState.isAwaiting === false) {
          setTimeout(renderInvalid, 1000);
        } else {
          feedback.textContent = '';
          elements.input.classList.remove('is-invalid');
          elements.feedback.classList.remove('text-success');
          elements.feedback.classList.remove('text-danger');
        }
        break;
      case 'language':
        setFeedbackText();
        if (watchedState.feeds.length) {
          renderFeeds(watchedState, i18nextInstance, elements);
          renderPosts(watchedState, i18nextInstance, elements);
        }
        break;
      default:
        throw new Error(path);
    }
  });
  return watchedState;
};
