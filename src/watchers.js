import onChange from 'on-change';

export default (state, elements) => {
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
    }
  });

  return watchedState;
};
