import * as yup from 'yup';
import locale from '../locales/yupLocale.js';
import view from './watchers.js';

export default () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
  };

  const state = {
    form: {
      value: '',
      error: [],
    },
    urls: [],
  };

  yup.setLocale(locale);
  const schema = yup.string().url();

  const watchedState = view(state, elements);

  elements.form.addEventListener('input', ({ target }) => {
    const formData = new FormData(elements.form);
    const input = target.name;
    const value = formData.get(input).trim();
    state.form.value = value;
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    schema.notOneOf(state.urls)
      .validate(state.form.value, { abortEarly: false })
      .then((url) => {
        watchedState.form.error = [];
        watchedState.urls.push(url);

        elements.form.reset();
        elements.input.focus();
      })
      .catch((err) => {
        const messages = err.errors.map((error) => error.key);
        watchedState.form.error = messages;
        // console.log(messages);
      });
  });
};
