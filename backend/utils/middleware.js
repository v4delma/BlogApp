const User = require('../models/user');
const jwt = require('jsonwebtoken');

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  }
  next();
};

const userExtractor = async (request, response, next) => {
  let decodedToken;
  let error;

  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET);
  } catch (e) {
    error = e;
    console.error(e.message);
  }

  if (!request.token || !decodedToken) {
    if (error.name === 'TokenExpiredError') {
      return response
        .status(401)
        .json({ error: 'Token expired, logging out...' });
    } else {
      return response.status(401).json({ error: 'Token missing or invalid' });
    }
  }

  const user = await User.findById(decodedToken.id);

  request.user = user;

  next();
};

module.exports = {
  tokenExtractor,
  userExtractor,
};
