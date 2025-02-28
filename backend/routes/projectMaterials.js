const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Importar a conexão com o banco de dados


// Obter itens de orçamento por ID do projeto
router.get('/:projectId', (req, res) => {
  const { projectId } = req.params;
  const query = 'SELECT * FROM projectmaterials WHERE projectId = ?';
  db.query(query, [projectId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(results);
  });
});

// Adicionar um novo item de orçamento ao projeto
router.post('/', (req, res) => {
  const { projectId, name, value } = req.body;
  const query = 'INSERT INTO projectmaterials (projectId, name, value) VALUES (?, ?, ?)';
  db.query(query, [projectId, name, value], (err, results) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    res.status(201).json({ id: results.insertId, projectId, name, value });
  });
});

// Atualizar um item de orçamento do projeto
router.put('/:id', (req, res) => {
  const { name, value } = req.body;
  const query = 'UPDATE projectmaterials SET name = ?, value = ? WHERE id = ?';
  db.query(query, [name, value, req.params.id], (err, results) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    res.json({ id: req.params.id, name, value });
  });
});

// Deletar um item de orçamento do projeto
router.delete('/:id', (req, res) => {
  const query = 'DELETE FROM projectmaterials WHERE id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json({ message: 'Item de orçamento deletado com sucesso' });
  });
});

module.exports = router;