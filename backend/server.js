const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

const db = require('./config/db'); // Importar a conexão com o banco de dados

// Configuração da sessão
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Defina como true se estiver usando HTTPS
}));

// Rota de login
app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;

    // Adicione logs para verificar o corpo da requisição
    console.log('Corpo da requisição:', req.body);
    console.log('Email:', email);
    console.log('Password:', password);

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Erro no servidor:', err);
            return res.status(500).json({ error: 'Erro no servidor' });
        }

        // Adicione logs para verificar os resultados da consulta
        console.log('Resultados da consulta:', results);

        if (results.length > 0) {
            const user = results[0];

            // Verificar se o usuário está bloqueado
            if (user.loginAttempts > 6) {
                return res.status(403).json({ error: 'Conta bloqueada. Tente novamente mais tarde.' });
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error('Erro no servidor:', err);
                    return res.status(500).json({ error: 'Erro no servidor' });
                }

                // Adicione logs para verificar o resultado da comparação de senhas
                console.log('Senha correta:', isMatch);

                if (isMatch) {
                    // Resetar o contador de tentativas de login
                    const resetAttemptsQuery = 'UPDATE users SET loginAttempts = 0 WHERE email = ?';
                    db.query(resetAttemptsQuery, [email], (err, results) => {
                        if (err) {
                            console.error('Erro ao resetar tentativas de login:', err);
                        }
                    });

                   // Armazenar o ID do usuário na sessão
                   req.session.userId = user.id;
                   res.status(200).json({ message: 'Login bem-sucedido!', redirectUrl: '/projects' });
                } else {
                    // Incrementar o contador de tentativas de login
                    const incrementAttemptsQuery = 'UPDATE users SET loginAttempts = loginAttempts + 1 WHERE email = ?';
                    db.query(incrementAttemptsQuery, [email], (err, results) => {
                        if (err) {
                            console.error('Erro ao incrementar tentativas de login:', err);
                        }
                    });

                    console.log('Senha incorreta para o usuário:', email);
                    res.status(401).json({ error: 'Credenciais inválidas' });
                }
            });
        } else {
            console.log('Usuário não encontrado:', email);
            res.status(401).json({ error: 'Credenciais inválidas' });
        }
    });
});

// Middleware para verificar a sessão
function authenticateSession(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
    }
    next();
}

// Exemplo de rota protegida
app.get('/api/protected', authenticateSession, (req, res) => {
    res.json({ message: 'Acesso permitido' });
});

// Importar e usar a rota de registro
const rotaRegistro = require('./routes/rotaRegistro');
app.use('/api', rotaRegistro);

// Importar e usar a rota de usuários
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);


// Importar e usar a rota de projetos
const projectsRouter = require('./routes/project');
app.use('/api/projects', projectsRouter);

const membersRouter = require('./routes/members');
app.use('/api/members', membersRouter);

// Importar e usar a rota de arquivos
const filesRouter = require('./routes/projectFiles');
app.use('/api/files', filesRouter);

// Importar e usar a rota de itens de orçamento
const budgetItemsRouter = require('./routes/projectMaterials');
app.use('/api/projectMaterials', budgetItemsRouter);

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../src/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/build', 'index.html'));
});

app.listen(5000, () => {
    console.log('Servidor rodando na porta 5000');
});