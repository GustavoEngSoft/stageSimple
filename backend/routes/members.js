const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Importar a conexão com o banco de dados
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Substitua pelo seu e-mail
    pass: process.env.EMAIL_PASS   // Substitua pela sua senha de e-mail
  }
});

// Função para enviar e-mail
const sendEmailNotification = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Substitua pelo seu e-mail
    to,
    subject,
    text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};


// Obter membros por ID do projeto
router.get('/:projectId', (req, res) => {
  const { projectId } = req.params;
  const query = `
    SELECT m.id, m.projectId, u.id as userId, u.name, u.email
    FROM members m
    JOIN users u ON m.member = u.id
    WHERE m.projectId = ?
  `;
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
    const newMemberId = { id: results.insertId, projectId, member };
    const getUserQuery = 'SELECT id, name, email FROM users WHERE id = ?';
    db.query(getUserQuery, [member], (err, userResults) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      const newMember = { id: newMemberId, projectId, ...userResults[0] };
      sendEmailNotification(userResults[0].email, 'You have been added to a project', `You have been added to project with ID: ${projectId}`);
      res.status(201).json(newMember);
    });
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