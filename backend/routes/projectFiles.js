const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../config/db'); // Importar a conexão com o banco de dados

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Obter arquivos por ID do projeto
router.get('/:projectId', (req, res) => {
  const { projectId } = req.params;
  const query = 'SELECT * FROM projectfiles WHERE projectId = ?';
  db.query(query, [projectId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(results);
  });
});

// Adicionar um novo arquivo ao projeto
router.post('/:projectId', upload.single('file'), (req, res) => {
  const { projectId } = req.params;
  const { originalname, buffer } = req.file;
  const query = 'INSERT INTO projectfiles (projectId, name, data) VALUES (?, ?, ?)';
  db.query(query, [projectId, originalname, buffer], (err, results) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    res.status(201).json({ id: results.insertId, projectId, name: originalname });
  });
});

// Endpoint para download do arquivo
router.get('/download/:fileId', (req, res) => {
  const { fileId } = req.params;
  const query = 'SELECT * FROM projectfiles WHERE id = ?';
  db.query(query, [fileId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }
    const file = results[0];
    res.setHeader('Content-Disposition', `attachment; filename=${file.name}`);
    res.send(file.data);
  });
});

// Deletar um arquivo do projeto
router.delete('/:projectId/:fileId', (req, res) => {
  const { projectId, fileId } = req.params;
  const query = 'DELETE FROM projectfiles WHERE projectId = ? AND id = ?';
  db.query(query, [projectId, fileId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json({ message: 'Arquivo deletado com sucesso' });
  });
});

module.exports = router;