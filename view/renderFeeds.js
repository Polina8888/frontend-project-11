import createCard from './createCard.js';

export default (watchedState, i18nextInstance, elements) => {
  const { feeds } = elements;
  feeds.innerHTML = '';
  const feedsCard = createCard(i18nextInstance, 'feeds');
  const feedsUl = document.createElement('ul');
  feedsUl.classList.add('list-group', 'border-0', 'rounded-0');
  feeds.append(feedsCard, feedsUl);

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
