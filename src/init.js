import * as yup from 'yup';
import i18next from 'i18next';
import locale from '../locales/yupLocale.js';
import view from './watchers.js';
import resources from '../locales/resources.js';
import getRss, { parseData } from './rss.js';

export default async () => {
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
      error: '',
    },
    urls: [],
    feeds: [],
    posts: [],
    language: 'ru',
  };

  yup.setLocale(locale);
  const schema = yup.string().url();

  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: state.language,
    resources,
  });

  Object.entries(elements.textNodes).forEach(([key, value]) => {
    value.textContent = i18nextInstance.t(key);
  });

  const watchedState = view(state, elements, i18nextInstance);

  elements.form.addEventListener('input', (e) => {
    const formData = new FormData(elements.form);
    const input = e.target.name;
    const value = formData.get(input).trim();
    state.form.value = value;
  });

  const checkUpdate = (urls) => {
    urls.forEach((url) => {
      fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
        .then((response) => response.json())
        .then((data) => {
          const { posts } = parseData(data);
          const postTitles = state.posts.map(({ postTitle }) => postTitle);
          const newPosts = posts.filter(({ postTitle }) => !postTitles.includes(postTitle));
          const newStatePosts = newPosts.concat(state.posts);
          watchedState.posts = newStatePosts;
          console.log(newPosts);
        });
    });
    setTimeout(() => checkUpdate(urls), 5000);
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    schema.notOneOf(state.urls)
      .validate(state.form.value, { abortEarly: false })
      .then((url) => {
        elements.form.reset();
        elements.input.focus();

        watchedState.form.error = '';
        watchedState.urls.push(url);
        getRss(state.urls[state.urls.length - 1], watchedState, i18nextInstance);

        checkUpdate(state.urls);
      })
      .catch((err) => {
        if (err.errors) {
          const messages = err.errors.map((error) => i18nextInstance.t(`errors.${error.key}`));
          watchedState.form.error = messages;
        }
      });
  });
};
