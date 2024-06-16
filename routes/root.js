const router = require('express').Router(); 
const handleRoot = require('../controllers/rootController'); 
router.get('^/$|index(.html)?$', (req, res)=>{
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
}); 
module.exports = router; 