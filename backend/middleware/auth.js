const db = require('../config/db');


const isProductManager = (req, res, next) => {
  const { email } = req.query;
  const query = 'SELECT role FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (results.length > 0 && results[0].role === 'Product Manager') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Only Product Managers can perform this action.' });
    }
  });
};

module.exports = {isProductManager };