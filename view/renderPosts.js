import modalController from '../src/modalController.js';
import createCard from './createCard.js';

export default (watchedState, i18nextInstance, elements) => {
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

    a.addEventListener('click', () => modalController(watchedState, postId));

    btn.addEventListener('click', () => modalController(watchedState, postId));
  });
};
