const express = require('express');

const userActions = require('../controllers/user-actions');

const router = express.Router();

router.post('/signup', userActions.createUser);

router.post('/login', userActions.verifyUser);

router.get('/logs', userActions.getLogs);

module.exports = router;