const router = require('express').Router();
const movieController = require('../controllers/movieController');
const authenticate = require('../middleware/auth');

router.get('/', movieController.getAll);
router.get('/:id', movieController.getById);
router.post('/', authenticate, movieController.create);
router.put('/:id', authenticate, movieController.update);
router.delete('/:id', authenticate, movieController.delete);

module.exports = router;