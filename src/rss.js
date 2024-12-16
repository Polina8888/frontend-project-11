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

export default async (url, watchedState) => {
  try {
    const response = await fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    const data = await response.json();

    const { feedTitle, feedDescription, posts } = parseData(data);

    posts.forEach((post) => watchedState.posts.unshift((post)));
    watchedState.feeds.unshift({ feedTitle, feedDescription });
    watchedState.urls.push(url);
  } catch (error) {
    throw new Error(error.message);
  }
};
