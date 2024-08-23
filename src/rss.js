const parseData = (data) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(data.contents, 'application/xml');
  const feedDescription = parsedData.querySelector('description').textContent;
  const feedTitle = parsedData.querySelector('title').textContent;
  const items = parsedData.querySelectorAll('item');
  const itemsData = Array.from(items).map((item) => ({
    liTitle: item.querySelector('title').textContent,
    liDescription: item.querySelector('description').textContent,
    liLink: item.querySelector('link').textContent,
  }));
  return { feedTitle, feedDescription, itemsData };
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

export const renderFeed = (watchedState, i18nextInstance, elements) => {
  elements.posts.innerHTML = '';
  elements.feeds.innerHTML = '';
  const postsCard = createCard(i18nextInstance, 'posts');
  const feedsCard = createCard(i18nextInstance, 'feeds');
  const postsUl = document.createElement('ul');
  const feedsUl = document.createElement('ul');
  postsUl.classList.add('list-group', 'border-0', 'rounded-0');
  feedsUl.classList.add('list-group', 'border-0', 'rounded-0');
  elements.posts.append(postsCard, postsUl);
  elements.feeds.append(feedsCard, feedsUl);

  watchedState.feed.forEach(({ feedTitle, feedDescription, itemsData }) => {
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

    itemsData.forEach(({ liTitle, liDescription, liLink }) => {
      const liEl = document.createElement('li');
      liEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

      const a = document.createElement('a');
      a.classList.add('fw-bold');
      a.setAttribute('href', liLink);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'nooper noreferrer');
      a.dataset.id = '16';
      a.textContent = liTitle;

      const btn = document.createElement('button');
      btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      btn.setAttribute('type', 'button');
      btn.dataset.id = '16';
      btn.dataset.bsToggle = 'modal';
      btn.dataset.bsTarget = '#modal';
      btn.textContent = i18nextInstance.t('preview');

      liEl.append(a, btn);
      postsUl.appendChild(liEl);
    });
  });
};

export default (link, watchedState, i18nextInstance) => {
  fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}`)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .then((data) => {
      if (data.status.http_code === 404) throw new Error('noData');
      watchedState.feed.unshift(parseData(data));
    })
    .catch((err) => {
      watchedState.form.error = i18nextInstance.t(`errors.${err.message}`);
    });
};
