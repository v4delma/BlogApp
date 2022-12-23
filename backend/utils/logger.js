const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('logger', ...params);
  }
};

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('logger', ...params);
  }
};

module.exports = {
  info,
  error,
};
