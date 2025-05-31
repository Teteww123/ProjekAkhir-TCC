const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const authenticate = require('../middleware/auth'); // jika ada

router.get('/', authenticate, movieController.getAll);
router.get('/:id', authenticate, movieController.getById);
router.post('/', authenticate, movieController.create);
router.put('/:id', authenticate, movieController.update);
router.delete('/:id', authenticate, movieController.delete);

module.exports = router;