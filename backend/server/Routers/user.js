const express = require('express');

const userRepository = require('../../repository/userRepository');

const repository = new userRepository();

const router = express.Router();



router.get('/api/user/:id', async (req, res) => {
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



module.exports = router;

