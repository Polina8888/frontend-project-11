export default {
  string: {
    url: () => ({ key: 'url' }),
  },
  mixed: {
    required: () => ({ key: 'required' }),
    notOneOf: () => ({ key: 'notOneOf' }),
  },
};
