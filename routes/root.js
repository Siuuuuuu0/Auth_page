const router = require('express').Router(); 
const handleRoot = require('../controllers/rootController'); 
router.get('/', handleRoot); 
module.exports = router; 