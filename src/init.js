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
      langBtn: document.querySelector('#lang-btn'),
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
    isAwaiting: false,
    language: 'ru',
    uiState: {
      visitedPosts: [],
      currentPostId: '',
    },
  };

  yup.setLocale(locale);

  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: state.language,
    resources,
  });

  const setTexts = () => {
    Object.entries(elements.textNodes).forEach((node) => {
      const [key, value] = node;
      value.textContent = i18nextInstance.t(key);
    });
  };

  const watchedState = view(state, elements, i18nextInstance);

  elements.textNodes.langBtn.addEventListener('click', () => {
    const language = watchedState.language === 'ru' ? 'en' : 'ru';
    i18nextInstance.changeLanguage(language).then(setTexts);
    watchedState.language = language;
  });

  elements.form.addEventListener('input', (e) => {
    const formData = new FormData(elements.form);
    const input = e.target.name;
    const value = formData.get(input).trim();
    state.form.value = value;
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    watchedState.isAwaiting = true;

    const schema = yup.string().url().notOneOf(state.urls);
    schema
      .validate(state.form.value, { abortEarly: false })
      .then(async (url) => {
        try {
          await getRss(url, watchedState);
          checkUpdate(state.urls, watchedState);
          watchedState.form.error = '';
          state.urls.push(url);
        } catch (error) {
          watchedState.isAwaiting = false;
          watchedState.form.error = error.message;
        }
      })
      .catch((err) => {
        if (err.errors) {
          const messages = err.errors.map((error) => error.key);
          watchedState.isAwaiting = false;
          [watchedState.form.error] = messages;
        }
      });
  });

  const modalController = (id, targetName) => {
    const post = watchedState.posts.find((statePost) => statePost.postId === id);
    const { postId } = post;

    if (targetName === 'BUTTON') {
      watchedState.uiState.currentPostId = id;
    }
    if (!watchedState.uiState.visitedPosts.includes(postId)) {
      watchedState.uiState.visitedPosts.push(postId);
    }
  };
  elements.posts.addEventListener('click', (e) => {
    modalController(e.target.dataset.id, e.target.tagName);
    watchedState.uiState.currentPostId = '';
  });
};
