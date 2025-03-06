const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Importar a conexão com o banco de dados
const {authenticateUser, isProductManager } = require('../middleware/auth');

// Função para formatar a data
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};

// Criar um novo projeto
router.post('/', authenticateUser, isProductManager, (req, res) => {
  const { name, startDate, userEmail } = req.body;
  const formattedDate = formatDate(startDate);
  const query = 'INSERT INTO projects (name, startDate, userEmail) VALUES (?, ?, ?)';
  db.query(query, [name, formattedDate, userEmail], (err, results) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    res.status(201).json({ id: results.insertId, name, startDate, userEmail });
  });
  console.log('Projeto criado com sucesso');
});

// Obter projetos por email do usuário
router.get('/', authenticateUser, (req, res) => {
  const {email} = req.query;
  const query = `SELECT p.*
  FROM projects p
  LEFT JOIN members m ON p.id = m.projectId
  LEFT JOIN users u ON m.member = u.id
  WHERE u.email = ? OR p.userEmail = ?
`;
  db.query(query, [email, email], (err, results) => {
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
router.put('/:id', authenticateUser, isProductManager, (req, res) => {
  const {id} = req.params;
  const { name, startDate, userEmail } = req.body;
  const formattedDate = formatDate(startDate);
  const query = 'UPDATE projects SET name = ?, startDate = ?, userEmail = ? WHERE id = ?';
  db.query(query, [name, formattedDate, userEmail, id], (err, results) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    res.json({ id: req.params.id, name, startDate, userEmail });
  });
});

// Atualizar o status do projeto
router.put('/:id/status', authenticateUser, isProductManager, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  const progress = (Object.values(status).filter(value => value).length / 4) * 100;
  const finalStatus = progress === 100 ? 'completed' : JSON.stringify(status);
  const query = 'UPDATE projects SET status = ?, progress = ? WHERE id = ?';
  db.query(query, [finalStatus, progress, id], (err, results) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    res.json({ id, status, progress });
  });
});  

// Deletar um projeto
router.delete('/:id', authenticateUser, isProductManager, (req, res) => {
  const {id} = req.params;
  const query = 'DELETE FROM projects WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json({ message: 'Projeto deletado com sucesso' });
  });
});

module.exports = router;