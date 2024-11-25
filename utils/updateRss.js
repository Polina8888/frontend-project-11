import { parseData } from '../src/rss.js';

const checkUpdate = async (urls, watchedState) => {
  urls.forEach((url) => {
    fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
      .then((response) => response.json())
      .then((data) => {
        const { posts } = parseData(data);
        const postTitles = watchedState.posts.map(({ postTitle }) => postTitle);
        const newPosts = posts.filter(({ postTitle }) => !postTitles.includes(postTitle));
        const newStatePosts = newPosts.concat(watchedState.posts);
        watchedState.posts = newStatePosts;
      })
      .catch((e) => console.error(e));
  });
  setTimeout(() => checkUpdate(urls, watchedState), 5000);
};

export default checkUpdate;
