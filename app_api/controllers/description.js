var mongoose = require('mongoose');
var Desc = mongoose.model('Description');

var sendJsonResponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

String.prototype.capitalize = function() {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});//.charAt(0).toUpperCase() + this.slice(1);
};

module.exports.getDescription = function (req, res) {
  console.log(req.params);

  if (req.params.countryname && !req.params.statename) {
    var capitCountry = req.params.countryname.capitalize();
    console.log(capitCountry);
    Desc
      .findOne({'name' : capitCountry})
      .exec(function (err, country) {
        if (!country) {
          sendJsonResponse(res, 404, {"message" : "countryname not found"});
          return;
        } else if (err) {
          sendJsonResponse(res, 404, err);
          return;
        }
        sendJsonResponse(res, 200, country);
      });
  } else if (req.params.countryname && req.params.statename) {
    var capitCountry = req.params.countryname.capitalize(),
        capitState = req.params.statename.capitalize();
    Desc
      .findOne({'name' : capitCountry})
//      .select('name states')
      .exec(function (err, country) {
        var response, state;
        if (!country) {
          sendJsonResponse(res, 404, {"message" : "countryname not found"});
          return;
        } else if (err) {
          sendJsonResponse(res, 400, err);
          return;
        }
        if (country.states) {
          for (var i=0; i<country.states.length;i++) {
            if (country.states[i].name === capitState) {
              state = country.states[i];
            }
          }
          if (!state) {
            sendJsonResponse(res, 404, {"message": "statename not found"});
          } else {
            stateres = {
              country: {
                name: country.name,
              },
              state: state
            }
            sendJsonResponse(res, 200, stateres);
          }
      } else {
        sendJsonResponse(res, 404, {"message": "No states found"});
      }
    });
  } else {
    sendJsonResponse(res, 404, {"message" : "No countryname in request"});
  }
};
