import { renderModal } from './modal.js';
import generateUniqueId from '../utils/generateId.js';

export const parseData = (data) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(data.contents, 'application/xml');
  try {
    const feedDescription = parsedData.querySelector('description').textContent;
    const feedTitle = parsedData.querySelector('title').textContent;
    const items = parsedData.querySelectorAll('item');
    const posts = Array.from(items).map((post) => {
      const uniqueId = generateUniqueId();

      return {
        postTitle: post.querySelector('title').textContent,
        postDescription: post.querySelector('description').textContent,
        postLink: post.querySelector('link').textContent,
        postId: uniqueId,
      };
    });

    return { feedTitle, feedDescription, posts };
  } catch (error) {
    throw new Error('noData');
  }
};

const createCard = (i18nextInstance, type) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18nextInstance.t(type);
  cardBody.append(cardTitle);
  card.append(cardBody);
  return card;
};

const clickModalFn = (watchedState, id) => {
  const post = watchedState.posts.find((statePost) => statePost.postId === id);
  const {
    postTitle, postDescription, postLink, postId,
  } = post;

  if (watchedState.uiState.visitedPosts.length) {
    if (!watchedState.uiState.visitedPosts.includes(postId)) {
      watchedState.uiState.currentPost = { postTitle, postDescription, postLink };
      watchedState.uiState.visitedPosts.push(postId);
    } else {
      watchedState.uiState.currentPost = { postTitle, postDescription, postLink };
      renderModal(watchedState);
    }
  } else {
    watchedState.uiState.currentPost = { postTitle, postDescription, postLink };
    watchedState.uiState.visitedPosts.push(postId);
  }
};

export const renderPosts = (watchedState, i18nextInstance, elements) => {
  elements.posts.innerHTML = '';
  const postsCard = createCard(i18nextInstance, 'posts');
  const postsUl = document.createElement('ul');
  postsUl.classList.add('list-group', 'border-0', 'rounded-0');
  elements.posts.append(postsCard, postsUl);

  watchedState.posts.forEach((post) => {
    const { postTitle, postLink, postId } = post;

    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    if (!watchedState.uiState.visitedPosts.includes(postId)) {
      a.classList.add('fw-bold');
    }
    a.setAttribute('href', postLink);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'nooper noreferrer');
    a.dataset.id = postId.toString();
    a.textContent = postTitle;

    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btn.setAttribute('type', 'button');
    btn.dataset.id = postId.toString();
    btn.dataset.bsToggle = 'modal';
    btn.dataset.bsTarget = '#modal';
    btn.textContent = i18nextInstance.t('preview');

    liEl.append(a, btn);
    postsUl.appendChild(liEl);

    a.addEventListener('click', () => clickModalFn(watchedState, postId));

    btn.addEventListener('click', () => clickModalFn(watchedState, postId));
  });
};

export const renderFeeds = (watchedState, i18nextInstance, elements) => {
  elements.feeds.innerHTML = '';
  const feedsCard = createCard(i18nextInstance, 'feeds');
  const feedsUl = document.createElement('ul');
  feedsUl.classList.add('list-group', 'border-0', 'rounded-0');
  elements.feeds.append(feedsCard, feedsUl);

  watchedState.feeds.forEach(({ feedTitle, feedDescription }) => {
    const feedsLi = document.createElement('li');
    feedsLi.classList.add('list-group-item', 'border-0', 'border-end-0');
    const feedsH3 = document.createElement('h3');
    feedsH3.classList.add('h6', 'm-0');
    feedsH3.textContent = feedTitle;
    const feedsP = document.createElement('p');
    feedsP.classList.add('m-0', 'small', 'text-black-50');
    feedsP.textContent = feedDescription;
    feedsLi.append(feedsH3, feedsP);
    feedsUl.append(feedsLi);
  });
};

export default (link, watchedState, i18nextInstance) => {
  fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Failed to fetch');
    })
    .then((data) => {
      const { feedTitle, feedDescription, posts } = parseData(data);
      watchedState.posts = posts.concat(watchedState.posts);
      watchedState.feeds.unshift({ feedTitle, feedDescription });
      watchedState.form.error = '';
    })
    .catch((err) => {
      watchedState.form.error = i18nextInstance.t(`errors.${err.message}`);
    });
};
