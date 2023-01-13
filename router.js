const Router = require('express').Router;
const userModel = require('./models/userModel');
const bcrypt = require('bcrypt');
const router = new Router();
const userController = require('./userController');
const auth = require('./auth');

router.post('/reg', userController.reg);
router.post('/log', userController.log);
router.get('/users', auth, userController.users);
router.post('/addAlbom', auth, userController.addAlbom);
router.get('/myAlboms', auth, userController.myAlboms);
router.get('/myAlbomsaz', auth, userController.myAlbomsaz);
router.get('/allAlboms', auth, userController.allAlboms);
router.delete('/myAlboms/:id', auth, userController.deleteMyAlbom);
router.post('/refresh', userController.refresh);


module.exports = router;