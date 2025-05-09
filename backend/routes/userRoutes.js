const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');


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
router.put('/me', authenticateSession, async (req, res) => {
  const userId = req.user.id;
  const { name, email, password,  birthdate, ssn, role, photo } = req.body;

  let hashedPassword = password;
  if (password) {
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      console.error('Erro ao hashear a senha:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
  }

  const query = 'UPDATE users SET name = ?, email = ?, password = ?, birthdate = ?, ssn = ?, role = ?, photo = ? WHERE id = ?';
  db.query(query, [name, email, hashedPassword,  birthdate, ssn, role, photo, userId], (err, results) => {
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