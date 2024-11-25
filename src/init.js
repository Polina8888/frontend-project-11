import * as yup from 'yup';
import i18next from 'i18next';
import locale from '../locales/yupLocale.js';
import view from '../view/watchers.js';
import resources from '../locales/resources.js';
import getRss from './rss.js';
import checkUpdate from '../utils/updateRss.js';

export default () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
    textNodes: {
      heading: document.querySelector('h1[class="display-3 mb-0"]'),
      subheading: document.querySelector('p[class="lead"]'),
      RSSLink: document.querySelector('label[for="url-input"]'),
      readAllBtn: document.querySelector('a[class="btn btn-primary full-article"]'),
      closeModalBtn: document.querySelector('button[class="btn btn-secondary"]'),
      addBtn: document.querySelector('button[class="h-100 btn btn-lg btn-primary px-sm-5"]'),
      example: document.querySelector('p[class="mt-2 mb-0 text-muted"]'),
    },
  };

  const state = {
    form: {
      value: '',
      error: 'error',
    },
    urls: [],
    feeds: [],
    posts: [],
    language: 'ru',
    uiState: {
      visitedPosts: [],
      currentPost: '',
    },
  };

  yup.setLocale(locale);
  const schema = yup.string().url();

  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: state.language,
    resources,
  });

  Object.entries(elements.textNodes).forEach((node) => {
    const [key, value] = node;
    value.textContent = i18nextInstance.t(key);
  });

  const watchedState = view(state, elements, i18nextInstance);

  elements.form.addEventListener('input', (e) => {
    const formData = new FormData(elements.form);
    const input = e.target.name;
    const value = formData.get(input).trim();
    state.form.value = value;
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    schema.notOneOf(state.urls)
      .validate(state.form.value, { abortEarly: false })
      .then((url) => {
        elements.form.reset();
        elements.input.focus();

        watchedState.urls.push(url);
        getRss(state.urls[state.urls.length - 1], watchedState, i18nextInstance);
        checkUpdate(state.urls, watchedState);
      })
      .catch((err) => {
        if (err.errors) {
          const messages = err.errors.map((error) => i18nextInstance.t(`errors.${error.key}`));
          [watchedState.form.error] = messages;
        }
      });
  });
};
