var fs = require('fs');
var topoData,
    topoSubData,
    globCountryid,
    globCountryname,
    sendJsonResponse = function (res, status, content) {
      res.status(status);
      res.json(content);
    };

module.exports.getCountries = function (req, res) {
  //if (req.params && req.params.countryname) {
    //globCountryname = req.params.countryname;

    fs.readFile('./app_api/data/countries.topo.json', 'utf-8', function(err, country) {
    	//if (err) throw err
    	topoData = JSON.parse(country);

      if (!country) {
        sendJsonResponse(res, 404, {"message" : "countryname not found"});
        return;
      } else if (err) {
        sendJsonResponse(res, 404, err);
        return;
      }
      sendJsonResponse(res, 200, topoData);
      //sendJsonResponse(res, 200, country);

      //var countrArr = topoData.objects.countries.geometries;

      //for (var i=0; i < countrArr.length; i++) {
        //if (countrArr[i].properties.name.toLowerCase() === globCountryname) {
          //console.log(countrArr[i].properties.name);
          //sendJsonResponse(res, 200, country);
          //globCountryid = countrArr[i].id;
        //}
      //}
    });
  //} else {
    //sendJsonResponse(res, 404, {"message" : "No countryname in request"});
  //}
}

module.exports.getStates = function (req, res) {
  if (req.params  && req.params.countryid /* && req.params.statename*/) {
    fs.readFile('./app_api/data/states_' + req.params.countryid + '.topo.json', 'utf-8', function(err, states) {
      //if (err) throw err
      topoSubData = JSON.parse(states);

      if (!states) {
        sendJsonResponse(res, 404, {"message" : "countryname not found"});//{"message" : "statename not found"});
        return;
      } else if (err) {
        sendJsonResponse(res, 404, err);
        return;
      }
      sendJsonResponse(res, 200, topoSubData);
/*
      var stateArr = topoSubData.objects.states.geometries;

      for (var i=0; i < stateArr.length; i++) {
        if (stateArr[i].properties.name.toLowerCase() === req.params.statename) {
          console.log(stateArr[i].properties.name);
          sendJsonResponse(res, 200, states);
        }
      }
      */
    });
  } else {
    sendJsonResponse(res, 404, {"message" : "No countryname in request"});//{"message" : "No statename in request"});
  }
}
