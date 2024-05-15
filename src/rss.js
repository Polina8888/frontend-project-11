import i18next from 'i18next';
import resources from '../locales/resources.js';

export default (link, watchedState) => {
  console.log('run');
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: watchedState.language,
    resources,
  });

  const parser = new DOMParser();
  fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}`)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .then((data) => {
      if (data.status.http_code === 404) throw new Error('noData');

      const parsedData = parser.parseFromString(data.contents, 'application/xml');
      const feedDescription = parsedData.querySelector('description').textContent;
      const feedTitle = parsedData.querySelector('title').textContent;
      const items = parsedData.querySelectorAll('item');
      const itemsDate = Array.from(items).map((item) => ({
        liTitle: item.querySelector('title').textContent,
        liDescription: item.querySelector('description').textContent,
        liLink: item.querySelector('link').textContent,
      }));

      const feedsDiv = document.querySelector('.feeds');
      const divCard = document.createElement('div');
      divCard.classList.add('card', 'border-0');
      feedsDiv.append(divCard);

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');
      divCard.append(cardBody);
      const cardTitle = document.createElement('h2');
      cardTitle.classList.add('card-title', 'h-4');
      cardTitle.textContent = i18nextInstance.t('feeds');
      cardBody.append(cardTitle);

      const feedsList = document.createElement('ul');
      feedsList.classList.add('list-group', 'border-0', 'rounded-0');
      divCard.append(feedsList);

      const title = document.createElement('h3');
      title.classList.add('h6', 'm-0');
      title.textContent = feedTitle;
      const description = document.createElement('p');
      description.classList.add('m-0', 'small', 'text-black-50');
      description.textContent = feedDescription;

      const li = document.createElement('li');
      li.classList.add('list-group-item', 'border-0', 'border-end-0');
      li.append(title, description);
      feedsList.append(li);

      const postsDiv = document.querySelector('.posts');
      const postsCard = document.createElement('div');
      postsCard.classList.add('card', 'border-0');
      postsDiv.append(postsCard);

      const postsBody = document.createElement('div');
      postsBody.classList.add('card-body');
      postsCard.append(postsBody);

      const postsTitle = document.createElement('h2');
      postsTitle.classList.add('card-title', 'h4');
      postsTitle.textContent = i18nextInstance.t('posts');
      postsBody.append(postsTitle);

      const postsList = document.createElement('ul');
      postsList.classList.add('list-group', 'border-0', 'rounded-0');
      postsCard.append(postsList);

      itemsDate.forEach(({ liTitle, liDescription, liLink }) => {
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
        postsList.appendChild(liEl);
      });
    })
    .catch((err) => {
      watchedState.form.error = i18nextInstance.t(`errors.${err.message}`);
    });
};
