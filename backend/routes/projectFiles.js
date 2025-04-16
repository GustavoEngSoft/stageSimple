const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../config/db'); // Importar a conexão com o banco de dados

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Obter arquivos por ID do projeto
router.get('/folders/:projectId', (req, res) => {
  const { projectId } = req.params;
  const query = 'SELECT * FROM folders WHERE projectId = ?';
  db.query(query, [projectId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(results);
  });
});

// Adicionar uma nova pasta ao projeto
router.post('/folders/:projectId', upload.single('file'), (req, res) => {
  const { projectId } = req.params;
  const {name} = req.body;
  const query = 'INSERT INTO folders (projectId, name) VALUES (?, ?)';
  db.query(query, [projectId, name], (err, results) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    res.status(201).json({ id: results.insertId, projectId, name });
  });
});

// Obter arquivos por ID do projeto e pasta
router.get('/:projectId/:folderId', (req, res) => {
  const { projectId, folderId } = req.params;
  const query = 'SELECT * FROM projectfiles WHERE projectId = ? AND folderId = ?';
  db.query(query, [projectId, folderId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(results);
  });
});

// Adicionar um novo arquivo ao projeto e pasta
router.post('/:projectId/:folderId', upload.single('file'), (req, res) => {
  const { projectId, folderId } = req.params;
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const { originalname, buffer, mimetype } = req.file;
  console.log('Buffer:', buffer.length);
  const query = 'INSERT INTO projectfiles (projectId, name, data, folderId, mimetype) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [projectId, originalname, buffer, folderId, mimetype], (err, results) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    res.status(201).json({ id: results.insertId, projectId, folderId, name: originalname });
  });
});

// Endpoint para download do arquivo
router.get('/download/:fileId', (req, res) => {
  const { fileId } = req.params;
  const query = 'SELECT * FROM projectfiles WHERE id = ?';
  db.query(query, [fileId], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }
    const file = results[0];
    res.setHeader('Content-Disposition', `attachment; filename=${file.name}`);
    res.setHeader('Content-Type', file.mimetype);
    res.send(file.data);
  });
});

// Deletar um arquivo do projeto e pasta
router.delete('/:projectId/:folderId/:fileId', (req, res) => {
  const { projectId, folderId, fileId } = req.params;
  const query = 'DELETE FROM projectfiles WHERE projectId = ? AND folderId = ? AND id = ?';
  db.query(query, [projectId, folderId, fileId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json({ message: 'Arquivo deletado com sucesso' });
  });
});

// Deletar uma pasta do projeto
router.delete('/folders/:projectId/:folderId', (req, res) => {
  const { projectId, folderId } = req.params;
  console.log(`Deleting folder ${folderId} from project ${projectId}`);
  // Primeiro, deletar todos os arquivos dentro da pasta
  const deleteFilesQuery = 'DELETE FROM projectfiles WHERE projectId = ? AND folderId = ?';
  db.query(deleteFilesQuery, [projectId, folderId], (err, results) => {
    if (err) {
      console.error('Error deleting files:', err);
      return res.status(500).json({ message: err.message });
    }

    // Depois, deletar a pasta
    const deleteFolderQuery = 'DELETE FROM folders WHERE id = ?';
    db.query(deleteFolderQuery, [folderId, projectId], (err, results) => {
      if (err) {
        console.error('Error deleting folder:', err);
        return res.status(500).json({ message: err.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Folder not found' });
      }
      res.json({ message: 'Pasta deletada com sucesso' });
    });
  });
});

module.exports = router;