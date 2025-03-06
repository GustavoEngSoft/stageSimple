const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Importar a conexão com o banco de dados
const { authenticateUser, isProductManager } = require('../middleware/auth');

// Obter todos os registros de folha de pagamento
router.get('/', authenticateUser, (req, res) => {
  const query = 'SELECT * FROM payroll';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(results);
  });
});

// Adicionar um novo registro de folha de pagamento
router.post('/', authenticateUser, isProductManager, (req, res) => {
  const { name, role, hoursWorked, hourlyRate } = req.body;
  const query = 'INSERT INTO payroll (name, role, hoursWorked, hourlyRate) VALUES (?, ?, ?, ?)';
  db.query(query, [name, role, hoursWorked, hourlyRate], (err, results) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    res.status(201).json({ id: results.insertId, name, role, hoursWorked, hourlyRate });
  });
});

// Atualizar um registro de folha de pagamento
router.put('/:id', authenticateUser, isProductManager, (req, res) => {
  const { id } = req.params;
  const { name, role, hoursWorked, hourlyRate } = req.body;
  const query = 'UPDATE payroll SET name = ?, role = ?, hoursWorked = ?, hourlyRate = ? WHERE id = ?';
  db.query(query, [name, role, hoursWorked, hourlyRate, id], (err, results) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    res.json({ id, name, role, hoursWorked, hourlyRate });
  });
});

// Deletar um registro de folha de pagamento
router.delete('/:id', authenticateUser, isProductManager, (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM payroll WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json({ message: 'Registro deletado com sucesso' });
  });
});

module.exports = router;