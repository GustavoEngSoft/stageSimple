const db = require('../config/db');

const authenticateUser = (req, res, next) => {
  if (!req.session.userId) {
    console.log('Sessão não autenticada');
    return res.sendStatus(401);
  }
  // Definir req.user com base no userId da sessão
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [req.session.userId], (err, results) => {
    if (err) {
      console.error('Erro no servidor:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    if (results.length > 0) {
      req.user = results[0];
      next();
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  });
};

const isProductManager = (req, res, next) => {
  if (!req.user || !req.user.email) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }

  const query = 'SELECT role FROM users WHERE email = ?';
  db.query(query, [req.user.email], (err, results) => {
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

module.exports = { authenticateUser, isProductManager };