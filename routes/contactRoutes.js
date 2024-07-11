const express = require('express');
const { markAsSpam, searchByName, searchByPhone } = require('../controllers/contactController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/mark-spam', authMiddleware, markAsSpam);
router.get('/search-name', authMiddleware, searchByName);
router.get('/search-phone', authMiddleware, searchByPhone);

module.exports = router;
