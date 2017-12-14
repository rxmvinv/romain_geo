var express = require('express');
var router = express.Router();
var ctrlTopo = require('../controllers/topo');
var ctrlDescription = require('../controllers/description');


//TopoJSON coordinates
router.get('/countries', ctrlTopo.getCountries);
router.get('/countries/:countryid/states/', ctrlTopo.getStates);

//Descriptions
router.get('/descriptions/:countryname', ctrlDescription.getDescription);
router.get('/descriptions/:countryname/states/:statename', ctrlDescription.getDescription);

module.exports = router;
