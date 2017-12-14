(function () {
  angular.module('romainGeo')
    .controller('mainCtrl', mainCtrl);

  function mainCtrl ($scope, $compile, $state, $stateParams, d3append, descriptionAppend) {

    var vm = this;
        vm.width = d3append.width;
        vm.height = d3append.height;
        vm.country = d3append.country;
        vm.state = d3append.state;
        vm.projection = d3append.projection();
        vm.path = d3append.path(vm.projection);
        vm.resize = d3append.resize();
        vm.zoom = d3append.zoom;
        vm.get_xyz = d3append.get_xyz;
        vm.description = descriptionAppend.description;
        vm.workDescription = descriptionAppend.workDescription;

        //d3append.someproperty = 'New property added by controller';

    var svg = d3.select("#map").append("svg")
       .attr("preserveAspectRatio", "xMidYMid")
       .attr("viewBox", "0 0 " + vm.width + " " + vm.height)
       .attr("width", $("#map").width())
       .attr("height", $("#map").width() * vm.height / vm.width);

   var rect = svg.append("rect")
       .attr("class", "background")
       .attr("width", vm.width)
       .attr("height", vm.height)
       .attr("ng-click", "country_clicked($event)");

   $compile(rect.node())($scope);

   var g = svg.append("g");

   d3.json("/api/countries", function(error, us) {
    g.append("g")
       .attr("id", "countries");
    var countriesLoaded = d3.select("#countries")
       .selectAll("path")
       .data(topojson.feature(us, us.objects.countries).features)
       .enter()
       .append("path")
       .attr("id", function(d) { return d.id; })
       .attr("name", function(d) { return d.properties.name.toLowerCase(); })
       .attr("d", vm.path)
       .attr("ng-click", "country_clicked($event)")
       .attr("ng-mouseover", "country_holded($event)")
       .attr("ng-mouseleave", "country_unholded($event)");
       compIt(countriesLoaded);
   });

   function compIt (arg) {
     var everyPath = arg[0];
       $compile(everyPath)($scope);
   };

   $scope.country_clicked = function ($event) {
     var d = $event.target;
     d3.select("#states").remove();

     if (d.attributes.name) {
       var curName = d.attributes.name.value;
       //console.log(curName);
       $state.go('main.country', {country: curName});

       var g = d3.select('#countries');

       if (vm.country) {
         g.selectAll("#" + vm.country.id).style('display', 'block');
       }

       if (d && vm.country !== d) {
         vm.country = d;
         var t = this.vm.country['__data__'];
         var xyz = vm.get_xyz(t, vm.path, vm.width, vm.height);

         if (d.id  == 'USA' || d.id == 'CAN') {
           var cName = "state_clicked($event, '" + curName + "', '" + d.id + "')";
           d3.json("/api/countries/" + vm.country.id.toLowerCase() + "/states/", function(error, us) {
            var statesLoaded = d3.select('svg g').append("g")
               .attr("id", "states")
               .selectAll("path")
               .data(topojson.feature(us, us.objects.states).features)
               .enter()
               .append("path")
               .attr("id", function(d) { return d.id; })
               .attr("name", function(d) { return d.properties.name.toLowerCase(); })
               .attr("class", "active")
               .attr("d", vm.path)
               .attr("ng-click", cName);
             compIt(statesLoaded);

             vm.zoom(xyz, vm.path, vm.projection);
           });

         } else if (d.id == 'GBR' || d.id == 'DEU' || d.id == 'RUS') {
           $(d).addClass("active");
           vm.zoom(xyz, vm.path, vm.projection);
           vm.workDescription(curName, d.id);
         } else {
           vm.zoom(xyz, vm.path, vm.projection);
           vm.workDescription(curName);
         }
       } else {
         $state.go('main');

         var xyz = [vm.width / 2, vm.height / 1.5, 1];
         vm.country = null;
         vm.zoom(xyz, vm.path, vm.projection);

         $('.pop').fadeOut('slow', function(){ $('.pop').remove(); });
         $('#countries path#'+d.id).removeClass('active');
       }
     } else {
       $state.go('main');

       var xyz = [vm.width / 2, vm.height / 1.5, 1];
       vm.country = null;
       vm.zoom(xyz, vm.path, vm.projection);

       $('.pop').fadeOut('slow', function(){ $('.pop').remove(); });
       $('#countries path.active').removeClass('active');
     }
   };

   $scope.country_holded = function ($event) {
     var d = $event.target;

     if (d.id  == 'USA' || d.id == 'CAN' || d.id == 'GBR' || d.id == 'DEU' || d.id == 'RUS') {
       if (!$('#countries path#'+d.id).hasClass("overactive")) {
         $('#countries path#'+d.id).addClass("overactive");
       }
     }
   };

   $scope.country_unholded = function ($event) {
     var d = $event.target;

     if($('#countries path#'+d.id).hasClass('overactive')) {
       $('#countries path#'+d.id).removeClass("overactive");
     }
   };

   $scope.state_clicked = function ($event, country, cid) {
     var d = $event.target;

     if (d.attributes.name) {
       var stateName = d.attributes.name.value;
       //console.log(stateName, ', ', cid);
       $state.go('main.state', {country: country, state: stateName});

       if (d && vm.state !== d) {
         vm.state = d;
         var t = this.vm.state['__data__'];
         var xyz = vm.get_xyz(t, vm.path, vm.width, vm.height);

         vm.workDescription(country, cid, stateName);
         vm.zoom(xyz, vm.path, vm.projection);
       } else {
         $state.go('main.country', {country: country});

         var t = this.vm.country['__data__'];
         var xyz = vm.get_xyz(t, vm.path, vm.width, vm.height);

         vm.state = null;
         vm.zoom(xyz, vm.path, vm.projection);

         $('.pop').fadeOut('slow', function(){ $('.pop').remove(); });
       }
     } else {
       $state.go('main');

       d3.select("#states").remove();

       var xyz = [vm.width / 2, vm.height / 1.5, 1];
       vm.state = null;
       vm.zoom(xyz, vm.path, vm.projection);

       $('.pop').fadeOut('slow', function(){ $('.pop').remove(); });
       $('.active').removeAttr('class', 'overactive');
     }
   }

  }

})();
