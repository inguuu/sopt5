var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'homework' });
  });
router.use('/news', require('./news'));
router.use('/thumbnail',require('./thumbnail'));
router.use('/info',require('./info'));
module.exports = router;