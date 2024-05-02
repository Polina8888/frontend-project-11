export default {
  string: {
    url: () => ({ key: 'Ссылка должна быть валидным URL' }),
  },
  mixed: {
    notOneOf: () => ({ key: 'RSS уже существует' }),
  },
};
