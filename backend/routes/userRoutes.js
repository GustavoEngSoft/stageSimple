const express = require('express');
const router = express.Router();
const db = require('../config/db');


// Middleware para verificar a sessão
const authenticateSession = (req, res, next) => {
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

// Endpoint para obter informações do usuário logado
router.get('/me', authenticateSession, (req, res) => {
  res.json(req.user);
});

// Endpoint para atualizar informações do usuário logado
router.put('/me', authenticateSession, (req, res) => {
  const userId = req.user.id;
  const { name, email, password, dateOfBirth, ssn, role, photo } = req.body;
  const query = 'UPDATE users SET name = ?, email = ?, password = ?, dateOfBirth = ?, ssn = ?, role = ?, photo = ? WHERE id = ?';
  db.query(query, [name, email, password, dateOfBirth, ssn, role, photo, userId], (err, results) => {
    if (err) {
      console.error('Erro no servidor:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    res.json({ message: 'Dados do usuário atualizados com sucesso' });
  });
});


// Endpoint para listar todos os usuários
router.get('/', authenticateSession, (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Erro no servidor:', err);
        return res.status(500).json({ error: 'Erro no servidor' });
      }
      res.json(results);
    });
});



module.exports = router;