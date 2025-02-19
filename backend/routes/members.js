const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Importar a conexão com o banco de dados

// Obter membros por ID do projeto
router.get('/:projectId', (req, res) => {
  const { projectId } = req.params;
  const query = 'SELECT * FROM members WHERE projectId = ?';
  db.query(query, [projectId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(results);
  });
});

// Adicionar um novo membro ao projeto
router.post('/:projectId', (req, res) => {
  const { projectId } = req.params;
  const { member } = req.body;
  const query = 'INSERT INTO members (projectId, member) VALUES (?, ?)';
  db.query(query, [projectId, member], (err, results) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    res.status(201).json({ id: results.insertId, projectId, member });
  });
});

// Deletar um membro do projeto
router.delete('/:projectId/:memberId', (req, res) => {
  const { projectId, memberId } = req.params;
  const query = 'DELETE FROM members WHERE projectId = ? AND id = ?';
  db.query(query, [projectId, memberId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json({ message: 'Membro deletado com sucesso' });
  });
});

module.exports = router;