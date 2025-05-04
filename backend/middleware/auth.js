const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (!decoded.id) {
      return res.status(401).json({ message: 'Invalid token format' });
    }
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
