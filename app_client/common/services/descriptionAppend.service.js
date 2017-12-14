(function () {
  angular.module('romainGeo')
    .service('descriptionAppend', descriptionAppend);

  function descriptionAppend() {
    var descAppObj =  {
      description: '',
      capitalize: function(ar) {
          return ar.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      },
      workDescription: function (d, t, s) {
        if (t) {
          $.ajax({
            url: '/api/descriptions/' + d,
            async: false,
            dataType: 'json',
            success: function (data) {
              descAppObj.description = data;
            }
          });

          if (descAppObj.description.info) {
            descAppObj.description = descAppObj.description.info.replace(';', ';\n\n');
          } else if (descAppObj.description.states) {
            var checker = descAppObj.capitalize(s),
                names = [],
                statesArr = descAppObj.description.states;
            for (var i=0;i<statesArr.length;i++) {
              if (checker === statesArr[i].name) {
                descAppObj.description = statesArr[i].info;
                names.push(statesArr[i].name);
                console.log(names);
                break;
              } else {
                continue;
              }
            }
            if (!names.length) {
              descAppObj.description = 'Coming soon. Looking forward to work with ' + checker + ', ' + t + ' in future.';
            }
          }
        } else {
          descAppObj.description = 'Coming soon. Looking forward to work with ' + descAppObj.capitalize(d) + ' in future.';
        }
        $('<div class="pop"></div>').fadeIn('slow').appendTo('#map');
        $('.pop').text(descAppObj.description);
      }
    }

  return descAppObj;
  }
})();
