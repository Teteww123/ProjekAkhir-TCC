
const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authenticate = require('../middleware/auth'); // jika ada

router.get('/',authenticate, favoriteController.getAll);
router.post('/', authenticate, favoriteController.create);
router.put('/:id', authenticate, favoriteController.update);
router.delete('/:id', authenticate, favoriteController.delete);

module.exports = router;