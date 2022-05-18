var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/myname', function(req, res, next) {
  res.send('Jill');
});

router.get('/myfavoritemovies', function(req, res, next) {
  res.json(["Dirty Dancing", "Gone With The Wind", "Tommy Boy"]);
});


module.exports = router;
