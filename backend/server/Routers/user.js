const express = require('express');

const userRepository = require('../../repository/userRepository');

const verifyToken = require('../middlewares/verifiToken');

const repository = new userRepository();

const router = express.Router();



router.get('/api/user/:id', verifyToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const user = await repository.findUserById(id);

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        res.json(user);

    } catch (error) {
        res.status(500).send('Error del servidor' + error.message);
    }
});

router.get('/api/users/me', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await repository.findUserById(userId);

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        res.json(user);
        
    } catch (error) {
        res.status(500).send('Error del servidor' + error.message);
    }
});



module.exports = router;

