require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const app = express();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

app.use(express.json());
app.use(express.static('public'));


// Endpoint pour créer un auteur
app.post('/auteurs', async (req, res) => {
    const { nom, email } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO auteurs (nom, email) VALUES ($1, $2) RETURNING *',
            [nom, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint pour récupérer tous les auteurs
app.get('/auteurs', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM auteurs');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint pour mettre à jour un auteur
app.put('/auteurs/:id', async (req, res) => {
    const { id } = req.params;
    const { nom, email } = req.body;
    try {
        const result = await pool.query(
            'UPDATE auteurs SET nom = $1, email = $2 WHERE id = $3 RETURNING *',
            [nom, email, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint pour supprimer un auteur
app.delete('/auteurs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM auteurs WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
