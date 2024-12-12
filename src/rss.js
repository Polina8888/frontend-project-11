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

export default (url, watchedState, i18nextInstance) => {
  fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Failed to fetch');
    })
    .then((data) => {
      const { feedTitle, feedDescription, posts } = parseData(data);
      watchedState.posts = posts.concat(watchedState.posts);
      watchedState.feeds.unshift({ feedTitle, feedDescription });
      watchedState.form.error = '';
      watchedState.urls.push(url);
    })
    .catch((err) => {
      watchedState.form.error = i18nextInstance.t(`errors.${err.message}`);
    });
};
