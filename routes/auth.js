// auth.js
const express = require('express');
const authController = require('../controllers/auth');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const router = express.Router();

router.post('/register', authController.register);

router.post('/login', async (req, res) => {
    try {
        // Récupérer les informations de l'utilisateur depuis la base de données
        const user = await getUserFromDatabase(req.body.email);

        // Vérifier si l'utilisateur existe et si le mot de passe est correct (vous devez implémenter cette logique)
        const isValidPassword = await checkPassword(req.body.password, user.password);

        if (isValidPassword) {
            // Définir un objet payload avec les informations nécessaires (dans cet exemple, l'email de l'utilisateur)
            const payload = {
                email: user.email,
            };

            // Utiliser la clé secrète pour signer le token JWT
            const secretKey = req.app.locals.secretKey;
            const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

            // Envoyer le token JWT en réponse
            res.json({ token });
        } else {
            // Le mot de passe est incorrect
            res.status(401).json({ message: 'Mot de passe incorrect' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
});

router.get('/logout', authController.logout);

module.exports = router;
