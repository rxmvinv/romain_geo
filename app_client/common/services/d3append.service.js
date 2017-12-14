(function () {
  angular.module('romainGeo')
    .service('d3append', d3append);

  function d3append () {
    var d3appendObj = {
      width: 938,
      height: 500,
      country: '',
      state: '',
      projection: function () {
        return d3.geo.mercator()
            .scale(150)
            .translate([d3appendObj.width / 2, d3appendObj.height / 1.5]);
      },
      path: function (pro) {
        return d3.geo.path()
            .projection(pro);//.projection(d3appendObj.projection);
      },

      resize: function () {
        $(window).resize(function() {
          var w = $("#map").width();
          $('svg').attr("width", w);
          $('svg').attr("height", w * d3appendObj.height / d3appendObj.width);
        });
      },
      zoom: function (xyz, path, projection) {
        d3.select('g').transition()
          .duration(750)
          .attr("transform", "translate(" + projection.translate() + ")scale(" + xyz[2] + ")translate(-" + xyz[0] + ",-" + xyz[1] + ")")
          .selectAll(["#countries", "#states", "#cities"])
          .style("stroke-width", 1.0 / xyz[2] + "px")
          .selectAll(".city")
          .attr("d", path.pointRadius(20.0 / xyz[2]));
      },
      get_xyz: function (d, path, width, height) {
        var bounds = path.bounds(d);
        var w_scale = (bounds[1][0] - bounds[0][0]) / width;
        var h_scale = (bounds[1][1] - bounds[0][1]) / height;
        var z = .96 / Math.max(w_scale, h_scale);
        var x = (bounds[1][0] + bounds[0][0]) / 2;
        var y = (bounds[1][1] + bounds[0][1]) / 2 + (height / z / 6);
        return [x, y, z];
      }
    };
    return d3appendObj;
  }
})();
