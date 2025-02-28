const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Importar a conexão com o banco de dados
const { isProductManager } = require('../middleware/auth');

// Função para formatar a data
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};

// Criar um novo projeto
router.post('/', isProductManager, (req, res) => {
  const { name, description, startDate, userEmail } = req.body;
  const formattedDate = formatDate(startDate);
  const query = 'INSERT INTO projects (name, description, startDate, userEmail) VALUES (?, ?, ?, ?)';
  db.query(query, [name, description, formattedDate, userEmail], (err, results) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    res.status(201).json({ id: results.insertId, name, description, startDate, userEmail });
  });
  console.log('Projeto criado com sucesso');
});

// Obter projetos por email do usuário
router.get('/', (req, res) => {
  const {email} = req.query;
  const query = `SELECT p.*
  FROM projects p
  LEFT JOIN members m ON p.id = m.projectId
  LEFT JOIN users u ON m.member = u.id
  WHERE u.email = ?
`;
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
     // Formatar a data antes de retornar os resultados
    const formattedResults = results.map(project => ({
      ...project,
      startDate: formatDate(project.startDate)
    }));
    res.json(formattedResults);
    console.log('Projetos obtidos com sucesso', results);
  });
});

// Obter um projeto por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM projects WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(results[0]);
  });
});

// Atualizar um projeto
router.put('/:id', isProductManager, (req, res) => {
  const {id} = req.params;
  const { name, description, startDate, userEmail } = req.body;
  const formattedDate = formatDate(startDate);
  const query = 'UPDATE projects SET name = ?, description = ?, startDate = ?, userEmail = ? WHERE id = ?';
  db.query(query, [name, description, formattedDate, userEmail, id], (err, results) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    res.json({ id: req.params.id, name, description, startDate, userEmail });
  });
});

// Deletar um projeto
router.delete('/:id', isProductManager, (req, res) => {
  const {id} = req.params;
  const query = 'DELETE FROM projects WHERE id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json({ message: 'Projeto deletado com sucesso' });
  });
});

module.exports = router;