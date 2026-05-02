const jwt = require('jsonwebtoken')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '')
  } else {
    req.token = null
  }
  next()
}

const userExtractor = (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: 'token missing' })
  }
  const decodedToken = jwt.verify(req.token, process.env.SECRET)  // ← fix this
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }
  req.user = decodedToken
  next()
}

module.exports = {
  tokenExtractor,
  userExtractor
}
