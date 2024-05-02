import onChange from 'on-change';

export default (state, elements) => {
  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.error') {
      if (watchedState.form.error) {
        elements.input.classList.add('is-invalid');
        elements.feedback.textContent = state.form.error;
        elements.feedback.classList.remove('text-success');
        elements.feedback.classList.add('text-danger');
      } else {
        elements.input.classList.remove('is-invalid');
        elements.feedback.classList.add('text-success');
        elements.feedback.classList.remove('text-danger');
      }
    }
  });

  return watchedState;
};
