const router = require('express').Router();
const favoriteController = require('../controllers/favoriteController');
const authenticate = require('../middleware/auth');

router.get('/', authenticate, favoriteController.getAll);
router.post('/', authenticate, favoriteController.add);
router.delete('/:id', authenticate, favoriteController.delete);

module.exports = router;